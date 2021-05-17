/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { ScriptInterface } from '../../interfaces'
import { uniqArray } from '../uniq-array'

export default function uniqScripts(
  scripts: ScriptInterface[],
): ScriptInterface[] {
  return uniqArray(scripts, ['name'])
}
