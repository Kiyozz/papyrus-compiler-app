/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Script } from '../../common/types/script'
import { ScriptStatus } from '../enums/script-status.enum'

export type ScriptRenderer = Script & {
  id: number
  status: ScriptStatus
}
