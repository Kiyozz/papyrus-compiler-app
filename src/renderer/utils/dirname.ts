/*
 * 2022-2026 Kiyozz.
 */

export const dirname = (path: string) => {
  if (path.length === 0) return '.'
  const lastSep = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'))
  if (lastSep === -1) return '.'
  if (lastSep === 0) return path[0] as string
  return path.slice(0, lastSep)
}
