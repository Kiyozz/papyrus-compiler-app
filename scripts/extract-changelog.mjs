// Prints the CHANGELOG.md section of a given version, used as the body of the
// GitHub release created by .github/workflows/release.yml.
import { readFile } from 'node:fs/promises'

const version = process.argv[2]

if (!version) {
  console.error('usage: node scripts/extract-changelog.mjs <version>')
  process.exit(1)
}

const changelog = await readFile(new URL('../CHANGELOG.md', import.meta.url), 'utf8')
const lines = changelog.split('\n')
const heading = new RegExp(`^## +v?${version.replace(/\./g, '\\.')}(\\s|$)`)
const start = lines.findIndex((line) => heading.test(line))

if (start === -1) {
  console.error(`no CHANGELOG.md entry found for ${version}`)
  process.exit(1)
}

const rest = lines.slice(start + 1)
const end = rest.findIndex((line) => line.startsWith('## '))

console.log((end === -1 ? rest : rest.slice(0, end)).join('\n').trim())
