export class FileEnsureException extends Error {
  constructor(filename: string) {
    super(`File "${filename}" seems to not exists or cannot be created.`)
  }
}
