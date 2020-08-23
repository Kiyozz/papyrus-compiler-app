export default class InvalidConfigurationException extends Error {
  constructor(gamePath: string, executable: string) {
    super(`"${gamePath}" is an invalid Skyrim directory. \nThe folder does not contains "${executable}".`)
  }
}
