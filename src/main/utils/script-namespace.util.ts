/*
 * 2026 Kiyozz.
 */

import { GameType } from '#common/game.ts'
import { Logger } from '../logger'
import * as path from '../path/path'
import { toSlash } from '../slash'

const logger = new Logger('ScriptNamespace')

const namespaceGames = new Set<GameType>([GameType.fo4, GameType.sf])

/**
 * First line of the script that is not a comment nor empty. The `ScriptName`
 * declaration is always the first statement of a psc file.
 */
function firstStatement(content: string): string | undefined {
  let inBlockComment = false

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()

    if (inBlockComment) {
      inBlockComment = !line.includes('/;')
      continue
    }

    if (line.startsWith(';/')) {
      inBlockComment = !line.slice(2).includes('/;')
      continue
    }

    if (line === '' || line.startsWith(';')) continue

    return line
  }

  return undefined
}

/**
 * `Scriptname Mod:Sub:Script extends Form` -> `Mod:Sub`
 */
async function readNamespace(scriptPath: string): Promise<string | undefined> {
  let content: string

  try {
    content = await path.readFile(scriptPath, 'utf8')
  } catch (e) {
    logger.warn('cannot read the script header', scriptPath, e)

    return undefined
  }

  const statement = firstStatement(content)

  if (statement === undefined) return undefined

  const declaration = /^scriptname\s+(?<name>[\w:]+)/i.exec(statement)
  const name = declaration?.groups?.name

  if (name === undefined || !name.includes(':')) return undefined

  return name.slice(0, name.lastIndexOf(':'))
}

/**
 * The compiler resolves `Mod:Script` as `<import>/Mod/Script.psc`, so the
 * folders of the script must mirror its namespace.
 */
function isInNamespaceFolders(scriptDir: string, parts: string[]): boolean {
  const segments = toSlash(scriptDir)
    .split('/')
    .filter((segment) => segment !== '')

  if (segments.length < parts.length) return false

  return segments
    .slice(-parts.length)
    .every((segment, i) => segment.toLowerCase() === parts[i]?.toLowerCase())
}

interface ResolvedScript {
  /** name given to the compiler: `Mod:Script` when namespaced, the file name otherwise */
  name: string
  /** folder to import: the namespace root when namespaced, the script folder otherwise */
  importDir: string
  namespace: string | undefined
}

/**
 * Namespaces exist since Fallout 4. The namespace is declared in the psc
 * header and drives both the name given to the compiler and the subfolder the
 * pex is written to.
 */
async function resolveScript(
  scriptPath: string,
  game: GameType,
): Promise<ResolvedScript> {
  const fileName = path.basename(scriptPath)
  const scriptDir = path.parentDir(scriptPath)
  const withoutNamespace: ResolvedScript = {
    name: fileName,
    importDir: scriptDir,
    namespace: undefined,
  }

  if (!namespaceGames.has(game)) return withoutNamespace

  const namespace = await readNamespace(scriptPath)

  if (namespace === undefined) return withoutNamespace

  const parts = namespace.split(':')

  if (!isInNamespaceFolders(scriptDir, parts)) {
    logger.warn(
      `"${fileName}" declares the namespace "${namespace}" but "${scriptDir}" does not match it, compiling without namespace`,
    )

    return withoutNamespace
  }

  const resolved: ResolvedScript = {
    name: `${namespace}:${fileName.replace(/\.psc$/i, '')}`,
    importDir: path.join(scriptDir, ...parts.map(() => '..')),
    namespace,
  }

  logger.debug('resolved namespaced script', resolved)

  return resolved
}

export { resolveScript }
export type { ResolvedScript }
