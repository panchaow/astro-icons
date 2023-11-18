import { extname } from 'node:path'
import type { AstroIntegration } from 'astro'
import type { Plugin } from 'vite'
import { resolveOptions } from './options.js'
import type { Options, ResolvedOptions } from './types.js'
import { loadIcon } from './loader.js'
import compiler from './compilers/astro.js'

const ICON_MODULE_ID_RE = /virtual:icons(?=\/)/

async function getViteConfiguration(options: ResolvedOptions) {
  function createPlugin(): Plugin {
    return {
      name: 'astro-icons',
      enforce: 'pre',
      resolveId(id) {
        if (ICON_MODULE_ID_RE.test(id)) {
          if (extname(id))
            return id
          return `${id}.astro`
        }
      },
      async load(id) {
        if (ICON_MODULE_ID_RE.test(id)) {
          const path = id.replace(ICON_MODULE_ID_RE, '')
          try {
            const code = await generateComponentFromPath(path, options)
            return {
              code,
              map: { version: 3, mappings: '', sources: [] } as any,
            }
          }
          catch (err) {
            console.error(`[astro-icons] ${err instanceof Error ? err.message : err}`)
          }
        }
      },
    }
  }

  return {
    plugins: [
      createPlugin(),
    ],
  }
}

export default function createIntegration(options: Options = {}): AstroIntegration {
  const resolved = resolveOptions(options)

  return {
    name: 'astro-icons',
    hooks: {
      'astro:config:setup': async function ({ updateConfig }) {
        updateConfig({
          vite: await getViteConfiguration(resolved),
        })
      },
    },
  }
}

async function generateComponentFromPath(path: string, options: ResolvedOptions) {
  const extension = extname(path)
  const stripped = path.slice(0, -extension.length)
  const [_, collection, icon] = stripped.split('/')
  if (!(collection && icon))
    throw new Error(`\`${stripped}\` is not a valid icon path!`)

  const iconifyIcon = await loadIcon(collection, icon, options)

  if (!iconifyIcon)
    throw new Error(`Failed to the icon at ${stripped}. Are you sure it exists?`)

  return compiler.compile(iconifyIcon, { collection, icon })
}
