/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { is } from 'electron-util'
import { release } from 'os'

import { Platform } from '../../common/types/platform'
import { EventSync } from '../interfaces/event-sync'

export class PlatformSync implements EventSync {
  onSync(): Platform {
    if (is.windows) return 'windows'

    if (is.linux) return 'linux'

    const isBigsur = parseInt(release().split('.')[0]) >= 11

    if (isBigsur) return 'macos-bigsur'

    return 'macos'
  }
}
