/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { v4 } from 'uuid'
import type { EventSync } from '../interfaces/event-sync'

export class UuidSync implements EventSync {
  onSync(): string {
    return v4()
  }
}
