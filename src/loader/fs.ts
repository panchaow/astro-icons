import { Effect, Option, flow, pipe } from 'effect'
import { loadCollectionFromFS } from '@iconify/utils/lib/loader/fs'
import { getIconData, iconToSVG } from '@iconify/utils'
import type { IconifyIconBuildResult } from '@iconify/utils'
import type { ResolvedOptions } from '../types.js'

export function loadIconFromFS(
  collection: string,
  icon: string,
  { autoInstall }: ResolvedOptions,
): Effect.Effect<never, unknown, Option.Option<IconifyIconBuildResult>> {
  return pipe(
    Effect.promise(async () => {
      const result = await loadCollectionFromFS(collection, autoInstall)
      return Option.fromNullable(result)
    }),
    Effect.map((flow(
      Option.flatMap(iconSet => Option.fromNullable(getIconData(iconSet, icon))),
      Option.map(i => iconToSVG(i)),
    ))),
  )
}
