export class Mo2ModsPathExistsException extends Error {
  constructor(mo2ModsPath: string) {
    super(JSON.stringify({ mo2ModsPath, message: `The folder "${mo2ModsPath}" does not exists. Your MO2 Instance is invalid.` }))
  }
}
