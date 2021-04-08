/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { is } from 'electron-util'
import fg from 'fast-glob'
import { promises as fs, existsSync, Stats } from 'fs'
import moveFile from 'move-file'
import * as path from 'path'

import { FileAccessException } from '../exceptions/files/file-access.exception'
import { FileEnsureException } from '../exceptions/files/file-ensure.exception'
import { Logger } from '../logger'
import { toSlash } from '../slash'
import { pluralize } from '../utils/pluralize.util'

const logger = new Logger('Path')

export function normalize(value: string): string {
  if (is.linux || is.macos) {
    return value
  }

  return value[0] + value.substring(1).toLowerCase()
}

export const join = path.join
export const move = (from: string, to: string): Promise<void> => {
  logger.debug('move file', from, 'to', to)
  return moveFile(from, to)
}

export const readFile = fs.readFile

export const writeFile = (
  ...args: Parameters<typeof fs['writeFile']>
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

export function exists(fileOrFolder: string): boolean {
  const result = existsSync(fileOrFolder)

  logger.debug('does the path exist?', fileOrFolder, result)

  return result
}

export async function ensureDir(item: string): Promise<void> {
  if (!exists(item)) {
    console.log(item)
    await fs.mkdir(item, { recursive: true })
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
    ...items.map(i => `"${i}"`)
  )

  for (const item of items) {
    try {
      await ensureDir(item)
    } catch (e) {
      throw new FileEnsureException(item, e)
    }
  }
}

export async function ensureFiles(items: string[]): Promise<void> {
  logger.debug(
    `checking presence of file${pluralize(items)}`,
    ...items.map(i => `"${i}"`)
  )

  for (const item of items) {
    try {
      await ensureFile(item)
    } catch (e) {
      throw new FileEnsureException(item)
    }
  }
}

export async function getPathsInFolder(
  fileNames: string[],
  options: fg.Options = {}
): Promise<string[]> {
  logger.debug(
    'retrieving paths from the folders',
    fileNames,
    'with options',
    options
  )

  const response = await fg(
    fileNames.map(file => toSlash(file)),
    {
      caseSensitiveMatch: false,
      ...options
    }
  )

  logger.debug('response of fast-glob', response)

  return response
}
