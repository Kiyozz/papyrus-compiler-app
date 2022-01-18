/*
 * Copyright (c) 2021 Kiyozz|WK.
 *
 * All rights reserved.
 */

import { promises as fs } from 'fs'
import path from 'path'

let version = process.argv[2]

if (!version) {
  process.exit(0)
}

version = version.replace('refs/tags/', '')

const versionWithoutV = version.replace('v', '')
const versionHeader = '##'
const changelog = (await fs.readFile(path.resolve('CHANGELOG.md'))).toString(
  'utf-8',
)

const regExp = new RegExp(
  `(${versionHeader}\\s(v)?${versionWithoutV}[\\s\\S]*?[^#]{3})${versionHeader}\\s`,
  'gi',
)
const extracted = regExp.exec(changelog)?.[1]

if (typeof extracted === 'undefined') {
  process.exit(0)
}

console.log(extracted.trim())
