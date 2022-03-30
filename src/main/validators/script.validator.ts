/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import type { Script } from '../../common/types/script'

const hasValidValues = (script: Script): boolean => {
  return (
    is.nonEmptyString(script.name.trim()) &&
    is.nonEmptyString(script.path.trim())
  )
}

export const validateScript = (script: Script | null | undefined): boolean => {
  return !is.nullOrUndefined(script) && hasValidValues(script)
}
