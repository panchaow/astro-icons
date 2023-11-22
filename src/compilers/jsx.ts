import { iconToSVG } from '@iconify/utils'
import { pascalize } from '@iconify/utils/lib/misc/strings'
import { importModule } from 'local-pkg'
import { replaceIDs } from '../utils/replace-ids.js'
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

    await options.customize(collection, icon, attributes)

    /* Don't replace */
    const { injectScripts, collectedIDs, svg: handled } = replaceIDs(body)

    const res = await svgr(
      `<svg>${handled}</svg>`,
      {
        plugins: ['@svgr/plugin-jsx'],
        svgProps: attributes,
        replaceAttrValues: collectedIDs.reduce<Record<string, string>>((acc, id) => {
          acc[id] = `{__id('${id}')}`
          acc[`url(#${id})`] = `{'url(#'+__id('${id}')+')'}`
          return acc
        }, {}),
        template: (variables: any, { tpl }: any) => {
          return tpl`
          ${variables.imports};

          ${variables.interfaces};

          const ${variables.componentName} = (${variables.props}) => {
            ${injectScripts}
            return ${variables.jsx}
          };
          
          ${variables.exports};
          `
        },
      },
      { componentName: pascalize(`${collection}-${icon}`) },
    )

    return res
  },
}

export default astroCompiler
