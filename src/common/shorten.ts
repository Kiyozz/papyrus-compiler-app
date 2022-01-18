/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import pathShorten, { Options } from 'path-shorten'

type ShortenResult = {
  path: string
  filename: string
}

const maxSlicesLength = 4

export const shorten = (text: string, options?: Options): ShortenResult => {
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
