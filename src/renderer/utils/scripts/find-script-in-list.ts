/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptInterface } from '../../interfaces'

export default function findScriptInList(
  scripts: ScriptInterface[],
  id: number,
  status: ScriptStatus
): ScriptInterface | undefined {
  const script = scripts.find(s => s.id === id)

  if (!script) {
    return
  }

  script.status = status

  return script
}
