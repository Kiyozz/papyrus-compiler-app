export class FileReadException extends Error {
  constructor(filename: string, err: string) {
    super(`Cannot read file "${filename}". ${err}`)
  }
}
