export default class Mo2ModsPathExistsException extends Error {
  constructor(mo2ModsPath: string) {
    super(`The folder "${mo2ModsPath}" does not exists. Your MO2 Instance is invalid.`)
  }
}
