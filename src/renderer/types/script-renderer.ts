/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { Script } from '../../common/types/script'
import type { ScriptStatus } from '../enums/script-status.enum'

export type ScriptRenderer = Script & {
  id: string
  status: ScriptStatus
}
