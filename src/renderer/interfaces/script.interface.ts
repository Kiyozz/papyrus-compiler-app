/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { Script } from '../../common/interfaces/script.interface'
import { ScriptStatus } from '../enums/script-status.enum'

export interface ScriptInterface extends Script {
  id: number
  status: ScriptStatus
}
