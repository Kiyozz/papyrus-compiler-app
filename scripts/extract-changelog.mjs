// Prints the CHANGELOG.md section of a given version. Used as the body of the
// GitHub release created by .github/workflows/release.yml.
//
// changesets/action can create that release on its own, but only as a published
// one. We need a draft, so we create it ourselves and read the notes here.
import { readFile } from 'node:fs/promises'

const version = process.argv[2]

if (!version) {
  console.error('usage: node scripts/extract-changelog.mjs <version>')
  process.exit(1)
}

const changelog = await readFile(
  new URL('../CHANGELOG.md', import.meta.url),
  'utf8',
)
const lines = changelog.split('\n')
// Matches the changesets format (`## 5.9.0`) and the legacy one
// (`## 5.8.0 (2022-05-06)`), with or without the `v` prefix.
const headings = [`## ${version}`, `## v${version}`]
const isHeading = (line) =>
  headings.some((heading) => line === heading || line.startsWith(`${heading} `))
const start = lines.findIndex(isHeading)

if (start === -1) {
  console.error(`no CHANGELOG.md entry found for ${version}`)
  process.exit(1)
}

const rest = lines.slice(start + 1)
const end = rest.findIndex((line) => line.startsWith('## '))

console.log((end === -1 ? rest : rest.slice(0, end)).join('\n').trim())
