export function toSlash(value: string): string {
  return value.replace(/\\/g, '/')
}

export function toAntiSlash(value: string): string {
  return value.replace(/\//g, '\\')
}
