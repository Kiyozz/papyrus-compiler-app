export class InvalidMo2InstanceFolderException extends Error {
  constructor(folder: string) {
    super(`The folder "${folder}" does not contains "downloads", "mods" and "profiles" folders.`)
  }
}
