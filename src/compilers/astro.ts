import { iconToSVG } from '@iconify/utils'
import type { Compiler } from '../types.js'

const astroCompiler: Compiler = {
  compile(icon) {
    const { attributes, body } = iconToSVG(icon)

    const typeDefs: string[] = []
    const defs: string[] = []

    typeDefs.push('interface Props extends astroHTML.JSX.SVGAttributes {};')
    defs.push(`const defaultAttrs = ${JSON.stringify(attributes)}`)
    defs.push('const props = Astro.props;')
    defs.push('const mergedAttrs = {...defaultAttrs, ...props};')

    const script = ['---', ...typeDefs, ...defs, '---'].join('\n')
    const template = `<svg {...mergedAttrs}>${body}</svg>`

    return `${script}\n${template}\n`
  },
}

export default astroCompiler
