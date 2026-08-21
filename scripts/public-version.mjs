// Bumps the public, calendar-style release number in package.json: 2026.1,
// 2026.2, ... then 2027.1 on the first release of the next year.
// Run by `pnpm changeset:version`, right after the semver bump, so the new
// number lands in the release pull request along with the CHANGELOG entry.
import { readFile, writeFile } from 'node:fs/promises'

const url = new URL('../package.json', import.meta.url)
const source = await readFile(url, 'utf8')
const current = JSON.parse(source).publicVersion

if (typeof current !== 'string') {
  console.error('package.json has no "publicVersion" field')
  process.exit(1)
}

const year = new Date().getFullYear()
const [currentYear, currentNumber] = current.split('.').map(Number)
const next = currentYear === year ? `${year}.${currentNumber + 1}` : `${year}.1`

await writeFile(
  url,
  source.replace(`"publicVersion": "${current}"`, `"publicVersion": "${next}"`),
)

console.log(`public version: ${current} -> ${next}`)
