export class FileEnsureException extends Error {
  constructor(item: string) {
    super(`"${item}" cannot be created.`)
  }
}
