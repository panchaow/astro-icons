import type { Options, ResolvedOptions } from './types.js'

export function resolveOptions(options: Options): ResolvedOptions {
  const {
    autoInstall = false,
  } = options

  return {
    autoInstall,
  }
}
