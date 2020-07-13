export class InvalidConfigurationException extends Error {
  constructor(gamePath: string, executable: string) {
    super(JSON.stringify({
      gamePath,
      executable
    }))

    // super(`\n"${gamePath}" is an invalid Skyrim directory. \nThe folder does not contains "${executable}".`)
  }
}
