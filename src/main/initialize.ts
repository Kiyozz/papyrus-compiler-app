/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { is } from 'electron-util'
import * as EVENTS from '../common/events'
import { appStore } from '../common/store'
import { BadInstallationHandler } from './event-handlers/bad-installation.handler'
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
    [EVENTS.OpenDialog, new DialogHandler()],
    [EVENTS.BadInstallation, new BadInstallationHandler()],
    [EVENTS.ConfigUpdate, new ConfigUpdateHandler()],
    [EVENTS.ConfigGet, new ConfigGetHandler()],
    [EVENTS.FilesStats, new FileStatHandler()],
    [EVENTS.GetVersion, new GetVersionHandler()],
    [EVENTS.AppError, new InAppErrorHandler()],
    [EVENTS.IsProduction, new IsProductionHandler()],
    [EVENTS.ClipboardCopy, new ClipboardCopyHandler()]
  ])
  const events = new Map<string, EventInterface>([
    [EVENTS.CompileScriptStart, new ScriptCompileEvent()]
  ])

  logger.debug(appStore.path)

  registerMenu({
    win,
    openLogFile: (file: string) => {
      openFileHandler.listen(file)
    }
  })

  registerIpcEvents(handlers, events)
}
