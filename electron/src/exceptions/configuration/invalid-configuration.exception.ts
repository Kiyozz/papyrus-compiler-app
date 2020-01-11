export class InvalidConfigurationException extends Error {
  constructor(gamePath: string, executable: string) {
    super(`"${gamePath}" is an invalid Skyrim directory. Checks that this directory contains ${executable}`)
  }
}
