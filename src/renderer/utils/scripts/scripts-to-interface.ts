/*
 *   Copyright (c) 2021 Kiyozz
 *   All rights reserved.
 */

import { Script } from '../../../common/interfaces/script'
import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptInterface } from '../../interfaces'
import reorderScripts from './reorder-scripts'

export function scriptsToInterface(
  interfaces: ScriptInterface[],
  scripts: Script[],
): ScriptInterface[] {
  return reorderScripts([
    ...interfaces,
    ...scripts.map(
      s =>
        ({
          ...s,
          id: 1,
          status: ScriptStatus.idle,
        } as ScriptInterface),
    ),
  ])
}
