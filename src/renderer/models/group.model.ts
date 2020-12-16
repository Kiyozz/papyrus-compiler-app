/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { ScriptModel } from './script.model'

export interface GroupModel {
  name: string
  scripts: ScriptModel[]
}

export class Group {
  constructor(public name: string, public scripts: ScriptModel[]) {}

  isEmpty() {
    return this.scripts.length === 0
  }
}
