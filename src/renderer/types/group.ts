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

export const isAllGroupsEmpty = (groups: Group[]): boolean => {
  return groups.every(g => g.isEmpty)
}

export class Group {
  constructor(public name: string, public scripts: ScriptRenderer[]) {}

  get isEmpty(): boolean {
    return is.emptyArray(this.scripts)
  }
}
