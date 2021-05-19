/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { uniqArray } from '../../../common/uniq-array'
import { ScriptInterface } from '../../interfaces'

export default function uniqScripts(
  scripts: ScriptInterface[],
): ScriptInterface[] {
  return uniqArray(scripts, ['name'])
}
