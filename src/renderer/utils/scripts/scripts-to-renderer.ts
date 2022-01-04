/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Script } from '../../../common/types/script'
import { ScriptStatus } from '../../enums/script-status.enum'
import { ScriptRenderer } from '../../types'
import { reorderScripts } from './reorder-scripts'

export const scriptsToRenderer = (
  interfaces: ScriptRenderer[],
  scripts: Script[],
): ScriptRenderer[] => {
  return reorderScripts([
    ...interfaces,
    ...scripts.map(
      s =>
        ({
          ...s,
          id: 1,
          status: ScriptStatus.idle,
        } as ScriptRenderer),
    ),
  ])
}
