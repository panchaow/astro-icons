import { Effect, pipe } from 'effect'
import { loadCustomIcon, loadIconFromFS } from './loaders/index.js'
import type { ResolvedOptions } from './types.js'

export default function loadIcon(
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
