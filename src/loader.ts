import type { IconifyIcon } from '@iconify/types'
import { getIconData } from '@iconify/utils'
import { loadCollectionFromFS } from '@iconify/utils/lib/loader/fs'
import type { ResolvedOptions } from './types.js'

export async function loadIcon(
  collection: string,
  icon: string,
  options: ResolvedOptions,
) {
  const {
    autoInstall,
  } = options

  let result: IconifyIcon | undefined

  const iconSet = await loadCollectionFromFS(collection, autoInstall)

  if (iconSet) {
    const iconData = getIconData(iconSet, icon)
    if (iconData)
      result = iconData
  }

  return result
}
