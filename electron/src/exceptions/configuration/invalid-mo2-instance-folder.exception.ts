export class InvalidMo2InstanceFolderException extends Error {
  constructor(folder: string) {
    super(JSON.stringify({
      folder,
      requiredFolders: ['downloads', 'mods', 'profiles'],
      message: `The folder "${folder}" does not contains "downloads", "mods" and "profiles" folders.`
    }))
  }
}
