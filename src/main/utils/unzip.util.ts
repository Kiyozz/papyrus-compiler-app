/*
 * 2026 Kiyozz.
 */

import { createWriteStream } from 'node:fs'
import { resolve, sep } from 'node:path'
import { pipeline } from 'node:stream/promises'
import { openPromise } from 'yauzl'
import { Logger } from '../logger'
import { ensureDir } from '../path/path'
import { toSlash } from '../slash'

const logger = new Logger('Unzip')

interface UnzipOptions {
  /** absolute folder the entries are written under */
  to: string
  /** only entries under this prefix are extracted, their path is kept */
  entryPrefix?: string
}

export function isDenied(e: unknown): boolean {
  const code = (e as { code?: string } | undefined)?.code

  return code === 'EPERM' || code === 'EACCES' || code === 'EROFS'
}

export async function unzip(
  archive: string,
  { to, entryPrefix }: UnzipOptions,
): Promise<void> {
  logger.info('extracting', archive, 'to', to)

  const root = resolve(to)
  // eachEntry closes the file on its own, on completion as on a throw
  const zipFile = await openPromise(archive, { lazyEntries: true })

  for await (const entry of zipFile.eachEntry()) {
    // the zip format asks for forward slashes, some writers use the windows
    // separator anyway
    const name = toSlash(entry.fileName)

    if (entryPrefix !== undefined && !name.startsWith(entryPrefix)) {
      continue
    }

    const target = resolve(root, name)

    // zip slip: an entry named `../..` would otherwise escape the target
    if (target !== root && !target.startsWith(root + sep)) {
      throw new Error(`the archive entry "${name}" escapes ${root}`)
    }

    if (name.endsWith('/')) {
      await ensureDir(target)

      continue
    }

    await ensureDir(resolve(target, '..'))
    await pipeline(
      await zipFile.openReadStreamPromise(entry),
      createWriteStream(target),
    )
  }

  logger.info('extracted', archive)
}

/**
 * The path of one script the archive holds, relative to the extraction target.
 * Only the central directory is read, nothing is decompressed.
 */
export async function firstScript(
  archive: string,
  entryPrefix?: string,
): Promise<string | undefined> {
  const zipFile = await openPromise(archive, { lazyEntries: true })

  for await (const entry of zipFile.eachEntry()) {
    const name = toSlash(entry.fileName)

    if (entryPrefix !== undefined && !name.startsWith(entryPrefix)) {
      continue
    }

    if (name.toLowerCase().endsWith('.psc')) {
      // breaking out closes the file, eachEntry cleans up after itself
      return name
    }
  }

  return undefined
}
