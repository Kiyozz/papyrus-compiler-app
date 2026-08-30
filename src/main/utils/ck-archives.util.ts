/*
 * 2026 Kiyozz.
 */

import { readdirSync } from 'node:fs'
import { toSourceArchives } from '#common/game.ts'
import { Logger } from '../logger'
import * as path from '../path/path'
import { toSlash } from '../slash'
import { firstScript } from './unzip.util'
import type { Dirent } from 'node:fs'
import type { GamePath, GameType, SourceArchive } from '#common/game.ts'

const logger = new Logger('CkArchives')

const zipsIn = (folder: string): string[] => {
  try {
    return readdirSync(folder)
      .filter((file) => file.toLowerCase().endsWith('.zip'))
      .map((file) => path.join(folder, file))
  } catch (e) {
    logger.warn('cannot list the archives of', folder, e)

    return []
  }
}

/**
 * The archives under `folder` and under each of its subfolders: the fo4 kit
 * drops every archive inside the folder it fills, `Scripts/Source/DLC01/
 * DLC01.zip`, and which ones exist depends on the dlc and creations the user
 * owns. They are searched for rather than listed.
 */
const searchArchives = (folder: string): string[] => {
  if (!path.exists(folder)) {
    return []
  }

  let entries: Dirent[]

  try {
    entries = readdirSync(folder, { withFileTypes: true })
  } catch (e) {
    logger.warn('cannot list', folder, e)

    return []
  }

  return [
    ...zipsIn(folder),
    ...entries
      .filter((entry) => entry.isDirectory())
      .flatMap((entry) => zipsIn(path.join(folder, entry.name))),
  ]
}

/**
 * Where a searched archive unfolds. The fo4 kit is not consistent about it:
 * `Base.zip` holds its scripts at the root and fills the `Base` folder it sits
 * in, while `DLC01.zip` carries a `DLC01` folder and therefore unfolds into
 * the parent. The archive itself is the only thing that can tell them apart.
 */
const searchTarget = (archive: string, script?: string): string => {
  const folder = path.parentDir(archive)

  if (script === undefined) {
    return folder
  }

  const root = `${path.basename(folder).toLowerCase()}/`

  return script.toLowerCase().startsWith(root) ? path.parentDir(folder) : folder
}

export interface ResolvedArchive {
  /** absolute path of the archive, it exists on disk */
  path: string
  name: string
  kind: SourceArchive['kind']
  /** absolute folder the entries are written under */
  to: string
  entryPrefix?: string
  /**
   * one script the archive holds, relative to `to`. Undefined when PCA cannot
   * read the archive - a rar - or when it holds no script at all.
   */
  script?: string
}

/** every source archive the game ships that is present on disk */
export async function resolveArchives(
  gamePath: GamePath,
  gameType: GameType,
): Promise<ResolvedArchive[]> {
  const resolved = toSourceArchives(gameType).flatMap((archive) => {
    const from = path.join(gamePath, archive.from)

    if (archive.search === true) {
      return searchArchives(from).map((file) => ({ file, archive }))
    }

    return path.exists(from) ? [{ file: from, archive }] : []
  })

  return Promise.all(
    resolved.map(async ({ file, archive }) => {
      const script =
        archive.kind === 'zip'
          ? await firstScript(file, archive.entryPrefix)
          : undefined

      return {
        path: file,
        name: path.basename(file),
        kind: archive.kind,
        to:
          archive.search === true
            ? searchTarget(file, script)
            : path.join(gamePath, archive.to),
        entryPrefix: archive.entryPrefix,
        script,
      }
    }),
  )
}

/**
 * Whether the archive was already extracted, by looking for one of the scripts
 * it holds. Reading the archive is what makes this exact: the folder an
 * archive produces is its own business, and guessing it from the file name
 * would report `CreationClub.zip` as pending forever.
 *
 * `undefined` when the archive cannot answer, and the caller falls back to the
 * presence of the game sources.
 */
export function isExtracted(archive: ResolvedArchive): boolean | undefined {
  if (archive.script === undefined) {
    return undefined
  }

  const extracted = path.exists(path.join(archive.to, toSlash(archive.script)))

  logger.debug(archive.name, 'extracted?', extracted, archive.script)

  return extracted
}
