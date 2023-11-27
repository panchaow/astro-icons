import { Effect, Option, pipe } from 'effect'
import { buildParsedSVG, parseSVGContent } from '@iconify/utils'
import type { IconifyIconBuildResult } from '@iconify/utils'
import type { ResolvedOptions } from '../types.js'

function buildSVG(svg: string): Option.Option<IconifyIconBuildResult> {
  return pipe(
    Option.fromNullable(parseSVGContent(svg)),
    Option.flatMap(parsed => Option.fromNullable(buildParsedSVG(parsed))),
  )
}

export function loadCustomIcon(
  collection: string,
  icon: string,
  options: ResolvedOptions,
): Effect.Effect<never, unknown, Option.Option<IconifyIconBuildResult>> {
  const custom = options.customCollections[collection]

  if (!custom)
    return Effect.succeed(Option.none())

  if (typeof custom === 'function') {
    return Effect.tryPromise(async () => {
      const result = await custom(icon)
      return pipe(
        Option.fromNullable(result),
        Option.flatMap(svg => buildSVG(svg)),
      )
    })
  }
  else {
    const inline = custom[icon]

    if (!inline)
      return Effect.succeed(Option.none())

    if (typeof inline === 'function') {
      return Effect.tryPromise(async () => {
        const result = await inline()
        return pipe(
          Option.fromNullable(result),
          Option.flatMap(svg => buildSVG(svg)),
        )
      })
    }

    return Effect.succeed(buildSVG(inline))
  }
}
