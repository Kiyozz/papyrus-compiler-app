/*
 * 2022-2026 Kiyozz.
 */

export class ConfigurationException extends Error {
  constructor(fileOrFolder: string) {
    super(`Invalid configuration: ${fileOrFolder}.`)
  }
}
