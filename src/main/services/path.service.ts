/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'
import { is } from 'electron-util'
import moveFile from 'move-file'
import fg from 'fast-glob'
import { toSlash } from '../../common/slash'
import { FileAccessException } from '../exceptions/files/file-access.exception'
import { FileEnsureException } from '../exceptions/files/file-ensure.exception'
import { Logger } from '../logger'
import { pluralize } from '../utils/pluralize.util'

const logger = new Logger('Path')

export function normalize(value: string): string {
  if (is.linux || is.macos) {
    return value
  }

  return value[0] + value.substring(1).toLowerCase()
}

export const join = path.join
export const move = moveFile

export const readFile = promisify(fs.readFile)

const fsMkDir = promisify(fs.mkdir)
const fsWriteFile = promisify(fs.writeFile)
const fsStat = promisify(fs.stat)

export async function stat(filename: string): Promise<fs.Stats> {
  logger.debug('retrieving path statistics', filename)

  try {
    return await fsStat(filename)
  } catch (e) {
    throw new FileAccessException(filename)
  }
}

export function exists(fileOrFolder: string): boolean {
  const result = fs.existsSync(fileOrFolder)

  logger.debug('does the path exist?', fileOrFolder, result)

  return result
}

export async function ensureDir(item: string): Promise<void> {
  if (!exists(item)) {
    await fsMkDir(item)
  }
}

export async function ensureFile(item: string): Promise<void> {
  if (!exists(item)) {
    await fsWriteFile(item, '')
  }
}

export async function ensureDirs(items: string[]): Promise<void> {
  logger.debug(
    `checking presence of director${pluralize(items, {
      single: 'y',
      multiple: 'ies'
    })}`,
    ...items.map(i => `"${i}"`)
  )

  for (const item of items) {
    try {
      await ensureDir(item)
    } catch (e) {
      throw new FileEnsureException(item)
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
