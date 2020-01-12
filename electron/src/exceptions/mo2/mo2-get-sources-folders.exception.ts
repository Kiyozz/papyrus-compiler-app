export class Mo2GetSourcesFoldersException extends Error {
  constructor(err: string) {
    super(`Cannot retrieve MO2 sources folders: "${err}"`)
  }
}
