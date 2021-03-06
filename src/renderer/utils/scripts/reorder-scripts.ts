/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { ScriptInterface } from '../../interfaces'

export default function reorderScripts(
  scripts: ScriptInterface[]
): ScriptInterface[] {
  return scripts.map((script, index) => ({ ...script, id: index }))
}
