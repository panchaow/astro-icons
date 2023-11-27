import { Effect, Option, flow, pipe } from 'effect'
import type { ResolvedOptions } from '../types.js'
import { loadIconFromFS } from './fs.js'
import { loadCustomIcon } from './custom.js'

export function loadIcon(
  collection: string,
  icon: string,
  options: ResolvedOptions,
) {
  return pipe(
    Effect.flatten(loadCustomIcon(collection, icon, options)),
    Effect.orElse(
      () => Effect.flatten(loadIconFromFS(collection, icon, options)),
    ),
  )
}
