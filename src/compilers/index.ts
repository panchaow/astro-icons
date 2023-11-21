import type { Compiler } from '../types.js'
import astroCompiler from './astro.js'
import jsxCompiler from './jsx.js'

export const compilers: Record<string, Compiler> = {
  '.astro': astroCompiler,
  '.jsx': jsxCompiler,
}
