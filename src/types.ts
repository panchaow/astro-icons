import type { IconifyIcon } from '@iconify/types'
import type { AutoInstall } from '@iconify/utils/lib/loader/types'

export type { AutoInstall }

export interface Options {
  /**
   * Auto install icon sources package when the usages is detected
   *
   * @default false
   */
  autoInstall?: AutoInstall
}

export type ResolvedOptions = Required<Options>

export interface Compiler {
  compile(icon: IconifyIcon, info: { collection: string; icon: string }): string | Promise<string>
}
