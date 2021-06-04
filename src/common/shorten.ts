/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import pathShorten, { Options } from 'path-shorten'

interface ShortenResult {
  path: string
  filename: string
}

const maxSlicesLength = 4

export function shorten(text: string, options?: Options): ShortenResult {
  if (text.length === 0)
    return {
      filename: text,
      path: text,
    }

  const buffer = pathShorten(text, options)
  const usedSlash = buffer.includes(':') && buffer.includes('\\') ? '\\' : '/'
  let slices = buffer.split(usedSlash)
  const firstSlice = slices[0]
  const filename = slices.pop() as string

  if (slices.length > maxSlicesLength) {
    console.log('c', buffer, slices)
    slices = slices.slice(slices.length - maxSlicesLength + 1)

    slices.unshift('...')
    slices.unshift(firstSlice)
  }

  const path = `${slices.join(usedSlash)}${usedSlash}`

  return {
    path,
    filename,
  }
}

export function textShorten(
  text: string,
  { length = 20 }: { length?: number },
): string {
  const slices = text.substring(0, length)

  if (slices.length === text.length) return text

  return `${slices}...`
}
