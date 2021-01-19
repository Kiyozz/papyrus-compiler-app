/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { MenuInterface } from '../../common/interfaces/menu.interface'
import { EventSyncInterface } from '../interfaces/event.sync.interface'

export class MenuSync implements EventSyncInterface<unknown, MenuInterface[]> {
  onSync() {
    return []
  }
}
