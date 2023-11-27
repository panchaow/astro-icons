import { extname } from 'node:path'
import { Effect, pipe } from 'effect'
import type { AstroIntegration } from 'astro'
import type { Plugin } from 'vite'
import { resolveOptions } from './options.js'
import type { Options, ResolvedOptions } from './types.js'
import { loadIcon } from './loader/loader.js'
import { compilers } from './compilers/index.js'

const ICON_MODULE_ID_RE = /virtual:icons(?=\/)/

async function getViteConfiguration(options: ResolvedOptions) {
  function createPlugin(): Plugin {
    return {
      name: 'astro-icons',
      enforce: 'pre',
      resolveId(id) {
        if (ICON_MODULE_ID_RE.test(id)) {
          if (isNormalized(id))
            return id

          return normalize(id)
        }
      },
      async load(id) {
        if (ICON_MODULE_ID_RE.test(id)) {
          const path = id.replace(ICON_MODULE_ID_RE, '')
          try {
            const program = generateComponentFromPath(path, options)

            const code = await Effect.runPromise(program)
            return {
              code,
              map: { version: 3, mappings: '', sources: [] } as any,
            }
          }
          catch (err) {
            console.error(err)
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

function isNormalized(id: string) {
  return !!extname(id)
}

function normalize(id: string) {
  const extMap: Record<string, string> = {
    '?astro': '.astro',
    '?react': '.jsx',
  }
  let ext: string | undefined

  const queryIndex = id.indexOf('?')
  if (queryIndex > 0)
    ext = extMap[id.slice(queryIndex)]

  ext = ext ?? '.astro'
  return `${queryIndex > 0 ? id.slice(0, queryIndex) : id}${ext}`
}

function genereteComponent(
  info: { collection: string; icon: string; ext: string },
  options: ResolvedOptions,
) {
  const { collection, icon, ext } = info

  return pipe(
    loadIcon(collection, icon, options),
    Effect.mapError(() => `[astro-icons] Icon \`${collection}/${icon}\` was not found. Is this a typo?`),
    Effect.flatMap((component) => {
      return Effect.promise(async () => {
        const compiler = compilers[ext]

        if (!compiler)
          throw new Error(`[astro-icons] \`${ext}\` is not supported yet.`)

        return await compiler.compile(component, { collection, icon }, options)
      })
    }),
  )
}

function generateComponentFromPath(
  path: string,
  options: ResolvedOptions,
): Effect.Effect<never, string, string> {
  const extension = extname(path)
  const stripped = path.slice(0, -extension.length)
  const [collection, icon] = stripped.slice(1).split('/')

  if (!(collection && icon))
    return Effect.fail(`[astro-icons] \`${stripped}\` is not a valid icon path!`)

  return genereteComponent({ collection, icon, ext: extension }, options)
}
