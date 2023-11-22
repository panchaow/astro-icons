import { iconToSVG } from '@iconify/utils'
import type { Compiler, ResolvedOptions } from '../types.js'
import { replaceIDs } from '../utils/replace-ids.js'

const astroCompiler: Compiler = {
  async compile(iconifyIcon, { collection, icon }, options: ResolvedOptions) {
    const result = iconToSVG(iconifyIcon)

    if (!result)
      return ''

    const { attributes, body } = result

    await options.customize(collection, icon, attributes)

    const { injectScripts, svg: handled } = replaceIDs(
      body,
      (_, id) => `id={__id('${id}')}`,
      (_, attr, id) => `${attr}={'url(#'+__id('${id}')+')'}`,
    )

    const typeDefs: string[] = []
    const defs: string[] = []

    typeDefs.push('interface Props extends astroHTML.JSX.SVGAttributes {};')
    defs.push(`const defaultAttrs = ${JSON.stringify(attributes)}`)
    defs.push('const props = Astro.props;')
    defs.push('const mergedAttrs = {...defaultAttrs, ...props};')

    const script = ['---', ...typeDefs, ...defs, injectScripts, '---'].join('\n')
    const template = `<svg {...mergedAttrs}>${handled}</svg>`

    return `${script}\n${template}\n`
  },
}

export default astroCompiler
