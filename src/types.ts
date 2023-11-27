import type { AutoInstall, CustomCollections, IconCustomizations, IconCustomizer } from '@iconify/utils/lib/loader/types'
import type { IconifyIconBuildResult } from '@iconify/utils'
import type { Awaitable } from './utils/types.js'

export type { AutoInstall }

export interface Options {
  /**
   * Auto install icon sources package when the usages is detected
   *
   * @default false
   */
  autoInstall?: AutoInstall
  /**
   * Collection of custom icons.
   */
  customCollections?: CustomCollections
  /**
   * Custom icon customizer, it will allow to customize all icons on a collection or individual icons.
   *
   *
   */
  iconCustomizer?: IconCustomizer
}

export type ResolvedOptions = Required<Options>

export interface Compiler {
  compile(svg: IconifyIconBuildResult, info: { collection: string; icon: string }, options: ResolvedOptions): string | Promise<string>
}
