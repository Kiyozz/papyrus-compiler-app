/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import { ScriptRenderer } from './script-renderer'

export type GroupRenderer = {
  name: string
  scripts: ScriptRenderer[]
}

export class Group {
  constructor(public name: string, public scripts: ScriptRenderer[]) {}

  get isEmpty(): boolean {
    return is.emptyArray(this.scripts)
  }
}
