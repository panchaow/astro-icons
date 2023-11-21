import { iconToSVG } from '@iconify/utils'
import { camelize } from '@iconify/utils/lib/misc/strings'
import { importModule } from 'local-pkg'
import type { Compiler, ResolvedOptions } from '../types.js'

const astroCompiler: Compiler = {
  async compile(iconifyIcon, { collection, icon }, options: ResolvedOptions) {
    const svgrCore = await importModule('@svgr/core')
    // check for v6/v7 transform (v7 on CJS it is in default), v5 default and previous versions
    const svgr = svgrCore.transform // v6 or v7 ESM
      || (svgrCore.default ? (svgrCore.default.transform /* v7 CJS */ ?? svgrCore.default) : svgrCore.default)
      || svgrCore

    const result = iconToSVG(iconifyIcon)

    if (!result)
      return ''

    const { attributes, body } = result
    let svg = `<svg>${body}</svg>`

    await options.customize(collection, icon, attributes)

    for (const [k, v] of Object.entries(attributes).reverse()) {
      if (v !== undefined)
        svg = svg.replace('<svg', `<svg ${k}="${v}"`)
    }

    const res = await svgr(
      svg,
      {
        plugins: ['@svgr/plugin-jsx'],
      },
      { componentName: camelize(`${collection}-${icon}`) },
    )

    return res
  },
}

export default astroCompiler
