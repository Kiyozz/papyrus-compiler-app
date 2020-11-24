/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

export class Mo2SourcesException extends Error {
  constructor(err: string) {
    super(`Cannot retrieve MO2 sources folders: "${err}"`)
  }
}
