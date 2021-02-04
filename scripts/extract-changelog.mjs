import fs from 'fs'
import path from 'path'

const version = process.argv[2]

if (!version) {
  process.exit(0)
}

const versionWithoutV = version.replace('v', '')

const versionHeader = '##'
const changelog = fs
  .readFileSync(path.resolve('CHANGELOG.md'))
  .toString('utf-8')

const regExp = new RegExp(
  `(${versionHeader}\\s(v)?${versionWithoutV}[\\s\\S]*?[^#]{3})${versionHeader}\\s`,
  'gi'
)
const extracted = regExp.exec(changelog)?.[1]

if (typeof extracted === 'undefined') {
  process.exit(0)
}

console.log(extracted)