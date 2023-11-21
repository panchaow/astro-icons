import { Effect, Option } from 'effect'
import type { IconifyIcon } from '@iconify/types'
import type { ResolvedOptions } from '../types.js'

export default function loadIcon(
  collection: string,
  icon: string,
  options: ResolvedOptions,
): Effect.Effect<never, unknown, Option.Option<IconifyIcon>> {
  return Effect.gen(function* (_) {
    const custom = options.customCollections[collection]

    if (!custom)
      return Option.none()

    if (typeof custom === 'function') {
      const res = yield * _(Effect.tryPromise(async () => {
        return await custom(icon)
      }))
      return Option.fromNullable(res)
    }

    const inline = custom[icon]

    if (!inline)
      return Option.none()

    if (typeof inline === 'function') {
      const res = yield * _(Effect.tryPromise(async () => {
        return await inline()
      }))
      return Option.fromNullable(res)
    }

    return Option.some(inline)
  })
}
