/*
 * 2026 Kiyozz.
 */

import { randomInt } from 'node:crypto'
import { open } from 'node:fs/promises'
import { AnonymizationException } from '../exceptions/anonymization.exception'
import { Logger } from '../logger'
import type { FileHandle } from 'node:fs/promises'

const logger = new Logger('AnonymizePex')

/**
 * The four magic bytes, read as a little endian integer. Skyrim writes its pex
 * big endian, Fallout 4 and Starfield little endian: the magic tells which, and
 * the rest of the header is then read the same way.
 */
const MAGIC_LITTLE = 0xfa57c0de
const MAGIC_BIG = 0xdec057fa

/** magic, versions, game id and compilation time all sit before the strings */
const HEADER_STRINGS_OFFSET = 4 + 1 + 1 + 2 + 8

interface PexString {
  /** where the characters start, the size is written just before them */
  offset: number
  size: number
  value: string
}

interface PexHeader {
  scriptPath: PexString
  userName: PexString
  computerName: PexString
}

async function readExact(
  file: FileHandle,
  pexPath: string,
  position: number,
  length: number,
): Promise<Buffer> {
  const buffer = Buffer.alloc(length)
  const { bytesRead } = await file.read(buffer, 0, length, position)

  if (bytesRead !== length) {
    throw new AnonymizationException(
      pexPath,
      `the file ends at ${position + bytesRead}, before its header does`,
    )
  }

  return buffer
}

async function readHeader(
  file: FileHandle,
  pexPath: string,
): Promise<PexHeader> {
  const magic = (await readExact(file, pexPath, 0, 4)).readUInt32LE(0)

  if (magic !== MAGIC_LITTLE && magic !== MAGIC_BIG) {
    throw new AnonymizationException(
      pexPath,
      `unknown file magic 0x${magic.toString(16).toUpperCase()}, this is not a compiled script`,
    )
  }

  const bigEndian = magic === MAGIC_BIG
  let position = HEADER_STRINGS_OFFSET

  const readString = async (): Promise<PexString> => {
    const sizeBuffer = await readExact(file, pexPath, position, 2)
    const size = bigEndian
      ? sizeBuffer.readUInt16BE(0)
      : sizeBuffer.readUInt16LE(0)
    const offset = position + 2
    // the compiler only ever writes ascii there, latin1 never throws on the
    // bytes a broken file could hold and keeps one character per byte, which
    // is what the sizes and offsets are counted in
    const value = (await readExact(file, pexPath, offset, size)).toString(
      'latin1',
    )

    position = offset + size

    return { offset, size, value }
  }

  return {
    scriptPath: await readString(),
    userName: await readString(),
    computerName: await readString(),
  }
}

function randomString(size: number, uppercase: boolean): string {
  const first = uppercase ? 65 : 97

  return Array.from({ length: size }, () =>
    String.fromCharCode(first + randomInt(26)),
  ).join('')
}

async function overwrite(
  file: FileHandle,
  { offset, size }: PexString,
  uppercase: boolean,
): Promise<void> {
  // a compiler other than the kit one may leave a field empty: there is nothing
  // to hide then, and nowhere to write it
  if (size === 0) {
    return
  }

  // the replacement has the exact same length: every offset after it, and the
  // rest of the file, stay where the compiler put them
  await file.write(
    Buffer.from(randomString(size, uppercase), 'ascii'),
    0,
    size,
    offset,
  )
}

/**
 * Replaces the source script path, the user name and the computer name the
 * compiler writes in the pex header with random strings of the same lengths.
 * Nothing else is touched, the compilation time included.
 *
 * Returns false when the script was already anonymized.
 */
export async function anonymizePex(pexPath: string): Promise<boolean> {
  logger.debug('anonymizing', pexPath)

  const file = await open(pexPath, 'r+')

  try {
    const header = await readHeader(file, pexPath)
    const { scriptPath, userName, computerName } = header

    // a path without an extension is a path this function already replaced
    if (!scriptPath.value.includes('.')) {
      logger.debug('already anonymized, nothing to do', pexPath)

      return false
    }

    // the path is the only field whose shape is known: it not being a psc file
    // means the header was read wrong, and writing at those offsets would
    // corrupt a compiled script that works
    if (!scriptPath.value.toLowerCase().endsWith('.psc')) {
      throw new AnonymizationException(
        pexPath,
        `the script path "${scriptPath.value}" is not a psc file`,
      )
    }

    await overwrite(file, scriptPath, false)
    await overwrite(file, userName, false)
    await overwrite(file, computerName, true)

    logger.info('anonymized', pexPath)

    return true
  } finally {
    await file.close()
  }
}
