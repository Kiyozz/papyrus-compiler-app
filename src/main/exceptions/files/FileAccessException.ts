export class FileAccessException extends Error {
  constructor(file: string) {
    super(`Cannot access file "${file}".`)
  }
}
