/*
 * 2022-2026 Kiyozz.
 */

import is from '@sindresorhus/is'
import { isAbsolute, join } from 'path'
import { LogLevel } from '#common/log-level.ts'
import type { SettingsStore } from '../store'

export function migrate590(store: SettingsStore): void {
  const logLevel = store.get('logLevel')

  if (is.undefined(logLevel)) {
    store.set('logLevel', LogLevel.info)
  }

  const mo2 = store.get('mo2') as unknown as Record<string, unknown> | undefined
  if (mo2 && is.object(mo2)) {
    store.set('mo2', { use: is.boolean(mo2.use) ? mo2.use : false })
  }

  const output = store.get('compilation.output') as string | undefined
  const gamePath = store.get('game.path') as string | undefined

  if (!is.string(output) || output.trim() === '') {
    store.set('compilation.output', '')
  } else if (!isAbsolute(output)) {
    if (is.nonEmptyString(gamePath) && gamePath.trim() !== '') {
      store.set('compilation.output', join(gamePath, output))
    } else {
      store.set('compilation.output', '')
    }
  }
}
