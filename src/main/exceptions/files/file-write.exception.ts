export class FileWriteException extends Error {
  constructor(filename: string, err: string) {
    super(`Cannot write to file "${filename}". ${err}`)
  }
}
