import { toSlash } from '@common/slash'
import { is } from 'electron-util'
import fg from 'fast-glob'
import fs from 'fs-extra'
import path from 'path'
import { FileAccessException } from '../exceptions/files/FileAccessException'
import { EnsureException } from '../exceptions/files/EnsureException'
import { Logger } from '../Logger'
import { pluralize } from './pluralize'

const logger = new Logger('PathHelper')

export function normalize(value: string): string {
  if (is.linux || is.macos) {
    return value
  }

  return value[0] + value.substring(1).toLowerCase()
}

export const join = path.join
export const move = fs.move

export const readFile = fs.readFile

export async function stat(filename: string): Promise<fs.Stats> {
  logger.debug('Getting statistics of the path', filename)

  try {
    return await fs.stat(filename)
  } catch (e) {
    throw new FileAccessException(filename)
  }
}

export async function exists(fileOrFolder: string): Promise<boolean> {
  const result = await fs.pathExists(fileOrFolder)

  logger.debug('Is the path exists?', fileOrFolder, result)

  return result
}

export async function ensureDirs(items: string[]): Promise<void> {
  logger.debug(
    `Checking presence of director${pluralize(items, {
      single: 'y',
      multiple: 'ies'
    })}`,
    ...items.map(i => `"${i}"`)
  )

  for (const item of items) {
    try {
      await fs.ensureDir(item)
    } catch (e) {
      throw new EnsureException(item)
    }
  }
}

export async function ensureFiles(items: string[]): Promise<void> {
  logger.debug(
    `Checking presence of file${pluralize(items)}`,
    ...items.map(i => `"${i}"`)
  )

  for (const item of items) {
    try {
      await fs.ensureFile(item)
    } catch (e) {
      throw new EnsureException(item)
    }
  }
}

export async function getPathsInFolder(
  fileNames: string[],
  options: fg.Options = {}
): Promise<string[]> {
  logger.debug('Getting paths in folder', fileNames, 'with options', options)

  const response = await fg(
    fileNames.map(file => toSlash(file)),
    {
      caseSensitiveMatch: false,
      ...options
    }
  )

  logger.debug('Response of fast-glob', response)

  return response
}
