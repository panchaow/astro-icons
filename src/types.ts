import type { IconifyIcon } from '@iconify/types'
import type { AutoInstall } from '@iconify/utils/lib/loader/types'
import type { Awaitable } from './utils/types.js'

export type { AutoInstall }

type CustomIconLoader = (icon: string) => Awaitable<IconifyIcon | undefined>

type InlineCollection = Record<string, IconifyIcon | (() => Awaitable<IconifyIcon | undefined>)>

type IconCustomizer = (collection: string, icon: string, props: Record<string, string>) => Awaitable<void>

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
  customCollections?: Record<string, CustomIconLoader | InlineCollection>
  /**
   * Custom icon customizer, it will allow to customize all icons on a collection or individual icons.
   *
   *
   */
  customize?: IconCustomizer
}

export type ResolvedOptions = Required<Options>

export interface Compiler {
  compile(iconifyIcon: IconifyIcon, info: { collection: string; icon: string }, options: ResolvedOptions): string | Promise<string>
}
