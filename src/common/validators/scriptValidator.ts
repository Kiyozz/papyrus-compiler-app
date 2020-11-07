import is from '@sindresorhus/is'
import { Script } from '@common/interfaces/Script'

function hasValidValues(script: Script): boolean {
  return (
    is.nonEmptyString(script.name?.trim()) &&
    is.nonEmptyString(script.path?.trim())
  )
}

export function scriptValidator(script: Script | null | undefined): boolean {
  return !is.nullOrUndefined(script) && hasValidValues(script)
}
