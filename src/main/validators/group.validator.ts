/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import { Group } from '../../common/types/group'
import { validateScript } from './script.validator'

function hasValidValues(group: Group): boolean {
  return (
    is.nonEmptyString(group.name?.trim()) && group.scripts.every(validateScript)
  )
}

export function validateGroup(group: Group | undefined | null): boolean {
  return !is.nullOrUndefined(group) && hasValidValues(group)
}
