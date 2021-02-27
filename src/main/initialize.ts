/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { is } from 'electron-util'
import { Events } from '../common/events'
import { appStore } from '../common/store'
import { CheckInstallationHandler } from './event-handlers/check-installation.handler'
import { ConfigGetHandler } from './event-handlers/config-get.handler'
import { ConfigUpdateHandler } from './event-handlers/config-update.handler'
import { DialogHandler } from './event-handlers/dialog.handler'
import { FileStatHandler } from './event-handlers/file-stat.handler'
import { GetVersionHandler } from './event-handlers/get-version.handler'
import { InAppErrorHandler } from './event-handlers/in-app-error.handler'
import { OpenFileHandler } from './event-handlers/open-file.handler'
import { IsProductionHandler } from './event-handlers/is-production.handler'
import { EventHandlerInterface } from './interfaces/event-handler.interface'
import { registerMenu } from './menu.register'
import { Logger } from './logger'
import { ensureFiles, move, writeFile } from './services/path.service'
import { registerIpcEvents } from './ipc-events.register'
import { ClipboardCopyHandler } from './event-handlers/clipboard-copy.handler'
import { EventInterface } from './interfaces/event.interface'
import { ScriptCompileEvent } from './event-handlers/script-compile.event'
import { EventSyncInterface } from './interfaces/event.sync.interface'

const logger = new Logger('Initialize')

function installExtensions() {
  if (is.development) {
    const installer = require('electron-devtools-installer')
    const extensions = [installer.REACT_DEVELOPER_TOOLS]

    return Promise.all(
      extensions.map(name => installer.default(name))
    ).catch(e => logger.warn(e))
  }
}

/**
 * Rename the current log file to have previous session log file
 */
async function backupLogFile() {
  const logFile = logger.file.path

  if (!logFile) {
    logger.info('there is no log file')

    return
  }

  await ensureFiles([logFile])

  const logFilename = logFile.replace('.log', '')

  await move(logFile, `${logFilename}.1.log`)
  await writeFile(logFile, '', { encoding: 'utf8' })

  logger.info(`file ${logFilename}.1.log created`)
}

export async function initialize(win: Electron.BrowserWindow) {
  await backupLogFile()
  await installExtensions()

  const openFileHandler = new OpenFileHandler()
  const handlers = new Map<string, EventHandlerInterface>([
    [Events.OpenDialog, new DialogHandler()],
    [Events.CheckInstallation, new CheckInstallationHandler()],
    [Events.ConfigUpdate, new ConfigUpdateHandler()],
    [Events.ConfigGet, new ConfigGetHandler()],
    [Events.FilesStats, new FileStatHandler()],
    [Events.GetVersion, new GetVersionHandler()],
    [Events.AppError, new InAppErrorHandler()],
    [Events.IsProduction, new IsProductionHandler()],
    [Events.ClipboardCopy, new ClipboardCopyHandler()]
  ])
  const events = new Map<string, EventInterface>([
    [Events.CompileScriptStart, new ScriptCompileEvent()]
  ])
  const syncs = new Map<string, EventSyncInterface>([])

  logger.debug(appStore.path)

  registerMenu({
    win,
    openLogFile: (file: string) => {
      openFileHandler.listen(file)
    }
  })

  registerIpcEvents(handlers, events, syncs)
}
