/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

export class ConfigurationException extends Error {
  constructor(fileOrFolder: string) {
    super(`Invalid configuration: ${fileOrFolder}.`)
  }
}
