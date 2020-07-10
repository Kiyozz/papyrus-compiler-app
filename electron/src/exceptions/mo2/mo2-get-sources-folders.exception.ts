export class Mo2GetSourcesFoldersException extends Error {
  constructor(err: string) {
    super(JSON.stringify({ err, message: `Cannot retrieve MO2 sources folders: "${err}"` }))
  }
}
