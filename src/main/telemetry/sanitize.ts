/*
 * 2026 Kiyozz.
 */

import { homedir, userInfo } from 'node:os'

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

function currentUser(): string[] {
  const values: string[] = []

  try {
    values.push(homedir())
    values.push(userInfo().username)
  } catch {
    // userInfo throws when the user has no entry in the system database
  }

  // a two letter username would redact half the words of a stack trace
  return values.filter((value) => value.length >= 3)
}

const replacements: [RegExp, string][] = [
  // file:///C:/Users/name/.../app.asar/assets/chunk.js:1:2301 -> chunk.js:1:2301
  [/file:\/\/[^\s)'"]*\/([^/\s)'"]+)/gi, '$1'],
  // C:\Users\name\...\file.psc or C:/Users/name/.../file.psc -> file.psc
  [/\b[a-z]:[\\/](?:[^\\/\s)'"]+[\\/])*([^\\/\s)'"]*)/gi, '$1'],
  // \\server\share\...\file.psc -> file.psc
  [/\\\\(?:[^\\\s)'"]+\\)+([^\\\s)'"]*)/g, '$1'],
  // /home/name/... or /Users/name/... -> ~/...
  [/\/(?:home|Users)\/[^/\s)'"]+/g, '~'],
]

/**
 * Error messages and stack traces carry absolute paths, and absolute paths
 * carry the user's name: only the file names are kept.
 */
export function sanitize(text: string): string {
  let result = text

  // the home folder can hold spaces the path patterns stop at, so it goes first
  for (const value of currentUser()) {
    result = result.replace(new RegExp(escape(value), 'gi'), '~')
  }

  for (const [pattern, replacement] of replacements) {
    result = result.replace(pattern, replacement)
  }

  return result
}

export function sanitizeProperties(value: unknown): unknown {
  if (typeof value === 'string') {
    return sanitize(value)
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeProperties)
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        sanitizeProperties(entry),
      ]),
    )
  }

  return value
}
