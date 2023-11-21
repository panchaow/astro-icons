import type { Options, ResolvedOptions } from './types.js'

export function resolveOptions(options: Options): ResolvedOptions {
  const {
    autoInstall = false,
    customCollections = {},
    customize = () => {},
  } = options

  return {
    autoInstall,
    customCollections,
    customize,
  }
}
