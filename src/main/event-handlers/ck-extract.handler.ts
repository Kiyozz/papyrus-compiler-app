/*
 * 2026 Kiyozz.
 */

import { fromError } from '#common/from-error.ts'
import { Logger } from '../logger'
import { toSlash } from '../slash'
import { resolveArchives } from '../utils/ck-archives.util'
import { isDenied, unzip } from '../utils/unzip.util'
import type { ExtractResult } from '#common/types/diagnostic.ts'
import { inject } from '#main/inject.ts'
import { SettingsStore } from '#main/store/settings/store.ts'

@inject()
export class CkExtractHandler {
  #logger = new Logger('CkExtractHandler')
  #settingsStore: SettingsStore

  constructor(settingsStore: SettingsStore) {
    this.#settingsStore = settingsStore
  }

  async listen(paths: string[]): Promise<ExtractResult[]> {
    const { path: gamePath, type: gameType } = this.#settingsStore.get('game')
    // the renderer only sends paths: resolving them again here keeps the
    // extraction inside the archives the game is known to ship
    const archives = await resolveArchives(gamePath, gameType)
    const results: ExtractResult[] = []

    for (const wanted of paths) {
      const archive = archives.find(
        (a) => toSlash(a.path).toLowerCase() === toSlash(wanted).toLowerCase(),
      )

      if (archive === undefined) {
        this.#logger.warn('not a known source archive', wanted)
        results.push({
          path: wanted,
          ok: false,
          error: 'this file is not a Creation Kit source archive',
        })

        continue
      }

      if (archive.kind !== 'zip') {
        results.push({
          path: wanted,
          ok: false,
          error: `PCA cannot extract a ${archive.kind} archive`,
        })

        continue
      }

      try {
        await unzip(archive.path, {
          to: archive.to,
          entryPrefix: archive.entryPrefix,
        })
        results.push({ path: wanted, ok: true })
      } catch (e) {
        const denied = isDenied(e)

        this.#logger.error('cannot extract', archive.path, e)
        results.push({
          path: wanted,
          ok: false,
          error: fromError(e).message,
          denied,
        })
      }
    }

    return results
  }
}
