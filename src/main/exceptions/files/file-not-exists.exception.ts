export class FileNotExistsException extends Error {
  constructor(filename: string) {
    super(`File ${filename} does not exists.`)
  }
}
