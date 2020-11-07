export default class InvalidConfigurationException extends Error {
  constructor(executable: string) {
    super(
      `Invalid configuration: "${executable}" does not resolve to a valid path`
    )
  }
}
