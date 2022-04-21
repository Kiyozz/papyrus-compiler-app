/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { IpcManager } from '@pca/electron-ipc'
import { Logger } from './logger'
import type { Event } from './interfaces/event'
import type { EventHandler } from './interfaces/event-handler'
import type { EventSync } from './interfaces/event-sync'

const logger = new Logger('RegisterIpcEvents')

export function registerIpcEvents(
  handlers: Map<string, EventHandler>,
  events: Map<string, Event>,
  syncs: Map<string, EventSync>,
): void {
  const manager = new IpcManager(logger)

  manager.registerHandlers(handlers)
  manager.registerEvents(events)
  manager.registerSyncs(syncs)
}
