/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

export class ConfigurationException extends Error {
  constructor(fileOrFolder: string) {
    super(`Invalid configuration: ${fileOrFolder}.`)
  }
}
