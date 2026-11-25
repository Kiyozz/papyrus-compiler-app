/*
 * 2022-2026 Kiyozz.
 */

import { promises as fs, existsSync, readdirSync } from 'node:fs'
import * as path from 'node:path'
import * as url from 'node:url'
import { is } from 'electron-util'
import { moveFile } from 'move-file'
import { FileAccessException } from '../exceptions/files/file-access.exception'
import { FileEnsureException } from '../exceptions/files/file-ensure.exception'
import { Logger } from '../logger'
import { pluralize } from '../utils/pluralize.util'
import type { Stats } from 'node:fs'

const logger = new Logger('Path')

/** see `exists` */
function isListed(fileOrFolder: string): boolean {
  const parent = path.dirname(fileOrFolder)

  if (parent === fileOrFolder) {
    return false
  }

  const name = path.basename(fileOrFolder).toLowerCase()

  try {
    return readdirSync(parent).some((entry) => entry.toLowerCase() === name)
  } catch {
    return false
  }
}

export { join, basename, isAbsolute, dirname as parentDir } from 'path'

export function dirname(meta: ImportMeta): string {
  return path.dirname(url.fileURLToPath(meta.url))
}

export function filename(meta: ImportMeta): string {
  return url.fileURLToPath(meta.url)
}

export function normalize(value: string): string {
  if (is.linux || is.macos || value.length === 0) {
    return value
  }

  return `${value[0] as string}${value.substring(1).toLowerCase()}`
}

export const move = (from: string, to: string): Promise<void> => {
  logger.debug('move file', from, 'to', to)
  return moveFile(from, to)
}

export const readFile = fs.readFile

export const writeFile = (
  ...args: Parameters<(typeof fs)['writeFile']>
): Promise<void> => {
  logger.debug('write file', args[0])

  return fs.writeFile(...args)
}

export async function stat(filename: string): Promise<Stats> {
  logger.debug('retrieving path statistics', filename)

  try {
    return await fs.stat(filename)
  } catch (e) {
    throw new FileAccessException(filename, e)
  }
}

/**
 * Whether `fileOrFolder` exists, also when it only lives in the Mod Organizer 2
 * virtual file system (usvfs), which merges every mod into Data - and, through
 * Root Builder, into the game root - for the programs MO2 launches.
 *
 * `existsSync` alone is not enough there: on Windows it stats the path, and
 * recent Windows 11 builds answer that stat with `GetFileInformationByName`,
 * which usvfs only hooks since 0.5.7.1. Under an older MO2, a file or folder
 * that sits in a mod is then reported missing while the compiler, a plain
 * child process, sees it. Listing the parent folder goes through
 * `NtQueryDirectoryFile`, which usvfs has always hooked. Windows paths ignore
 * case, so does the match.
 */
export function exists(fileOrFolder: string): boolean {
  const result = existsSync(fileOrFolder) || isListed(fileOrFolder)

  logger.debug('does the path exist?', fileOrFolder, result)

  return result
}

/**
 * Creates `item` and its missing parents. Not `mkdir` with `recursive`: on a
 * folder that already exists it stats it, and that stat fails with ENOENT on a
 * folder of the MO2 virtual file system - see `exists`. Data\Scripts, where
 * the pex go, is one as soon as a mod ships scripts and the game folder has
 * none.
 */
export async function ensureDir(item: string): Promise<void> {
  if (exists(item)) {
    return
  }

  const parent = path.dirname(item)

  if (parent !== item) {
    await ensureDir(parent)
  }

  try {
    await fs.mkdir(item)
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw e
    }
  }
}

export async function ensureFile(item: string): Promise<void> {
  if (!exists(item)) {
    await fs.writeFile(item, '')
  }
}

export async function ensureDirs(items: string[]): Promise<void> {
  logger.debug(
    `checking presence of folder${pluralize(items)}`,
    ...items.map((i) => `"${i}"`),
  )

  await Promise.all(
    items.map(async (item) => {
      try {
        await ensureDir(item)
      } catch (e) {
        throw new FileEnsureException(item, e)
      }
    }),
  )
}

export async function ensureFiles(items: string[]): Promise<void> {
  logger.debug(
    `checking presence of file${pluralize(items)}`,
    ...items.map((i) => `"${i}"`),
  )

  await Promise.all(
    items.map(async (item) => {
      try {
        await ensureFile(item)
      } catch (e) {
        throw new FileEnsureException(item, e)
      }
    }),
  )
}
