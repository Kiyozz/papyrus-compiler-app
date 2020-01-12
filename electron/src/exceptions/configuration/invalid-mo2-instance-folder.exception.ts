export class InvalidMo2InstanceFolderException extends Error {
  constructor(folder: string) {
    super(`Checks that directory ${folder} contains "downloads", "mods" and "profiles" directories.`)
  }
}
