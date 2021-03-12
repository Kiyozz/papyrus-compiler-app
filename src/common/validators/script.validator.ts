/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'

import { Script } from '../interfaces/script'

function hasValidValues(script: Script): boolean {
  return (
    is.nonEmptyString(script.name?.trim()) &&
    is.nonEmptyString(script.path?.trim())
  )
}

export function validateScript(script: Script | null | undefined): boolean {
  return !is.nullOrUndefined(script) && hasValidValues(script)
}
