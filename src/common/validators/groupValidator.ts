import is from '@sindresorhus/is'
import { Group } from '@common/interfaces/Group'
import { scriptValidator } from './scriptValidator'

function hasValidValues(group: Group): boolean {
  return (
    is.nonEmptyString(group.name?.trim()) &&
    group.scripts.every(scriptValidator)
  )
}

export function groupValidator(group: Group | undefined | null): boolean {
  return !is.nullOrUndefined(group) && hasValidValues(group)
}
