/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { ScriptRenderer } from './script-renderer'

export type GroupRenderer = {
  name: string
  scripts: ScriptRenderer[]
}

export class Group {
  constructor(public name: string, public scripts: ScriptRenderer[]) {}

  get isEmpty(): boolean {
    return this.scripts.length === 0
  }
}
