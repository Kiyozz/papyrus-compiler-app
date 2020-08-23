export default class Mo2InvalidInstanceException extends Error {
  constructor(folder: string) {
    super(`The folder "${folder}" does not contains "downloads", "mods" and "profiles" folders.`)
  }
}
