import { Effect, Option, pipe } from 'effect'
import { getIconData } from '@iconify/utils'
import type { IconifyIcon } from '@iconify/utils'
import { loadCollectionFromFS } from '@iconify/utils/lib/loader/fs'
import type { ResolvedOptions } from '../types.js'

export default function loadIcon(
  collection: string,
  icon: string,
  { autoInstall }: ResolvedOptions,
): Effect.Effect<never, unknown, Option.Option<IconifyIcon>> {
  return pipe(
    Effect.promise(async () => {
      return await loadCollectionFromFS(collection, autoInstall)
    }),
    Effect.map(Option.fromNullable),
    Effect.map(Option.flatMap(iconSet => Option.fromNullable(getIconData(iconSet, icon))),
    ),
  )
}
