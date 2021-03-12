/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Script } from '../../common/interfaces/script'
import { ScriptStatus } from '../enums/script-status.enum'

export interface ScriptInterface extends Script {
  id: number
  status: ScriptStatus
}
