import * as EVENTS from '@common/events'
import { is } from 'electron-util'
import { appStore } from '@common/store'
import { BadInstallationHandler } from './event-handlers/BadInstallationHandler'
import { ScriptCompileHandler } from './event-handlers/ScriptCompileHandler'
import { ConfigGetHandler } from './event-handlers/ConfigGetHandler'
import { ConfigUpdateHandler } from './event-handlers/ConfigUpdateHandler'
import { DialogHandler } from './event-handlers/DialogHandler'
import { FilesStatsHandler } from './event-handlers/FilesStatsHandler'
import { GetVersionHandler } from './event-handlers/GetVersionHandler'
import { InAppErrorHandler } from './event-handlers/InAppErrorHandler'
import { Mo2ModsSourcesHandler } from './event-handlers/Mo2ModsSourcesHandler'
import { OpenLogFileHandler } from './event-handlers/OpenLogFileHandler'
import { EventHandler } from './EventHandler'
import { registerMenus } from './registerMenus'
import { Logger } from './Logger'
import { ensureFiles, move } from './services/path'
import { registerIpcEvents } from './registerIpcEvents'

const logger = new Logger('Initialize')

function installExtensions() {
  if (is.development) {
    const installer = require('electron-devtools-installer')
    const extensions = [
      installer.REACT_DEVELOPER_TOOLS,
      installer.REDUX_DEVTOOLS
    ]

    return Promise.all(
      extensions.map(name => installer.default(name))
    ).catch(e => logger.log(e))
  }
}

/**
 * Rename the current log file to have previous session log file
 */
async function backupLogFile() {
  const logFile = logger.transports.file.getFile().path

  if (!logFile) {
    logger.info('There is no log file')

    return
  }

  logger.info('A log file exists, creation of a new one')

  await ensureFiles([logFile])

  const logFilename = logFile.replace('.log', '')

  await move(logFile, `${logFilename}.1.log`, { overwrite: true })
  await ensureFiles([logFile])

  logger.info(`file ${logFilename}.1.log created`)
}

export async function initialize() {
  await backupLogFile()
  await installExtensions()

  const openLogFileHandler = new OpenLogFileHandler()
  const events = new Map<string, EventHandler>([
    [EVENTS.COMPILE_SCRIPT, new ScriptCompileHandler()],
    [EVENTS.OPEN_DIALOG, new DialogHandler()],
    [EVENTS.MO2_MODS_SOURCES, new Mo2ModsSourcesHandler()],
    [EVENTS.BAD_INSTALLATION, new BadInstallationHandler()],
    [EVENTS.CONFIG_UPDATE, new ConfigUpdateHandler()],
    [EVENTS.CONFIG_GET, new ConfigGetHandler()],
    [EVENTS.FILES_STATS, new FilesStatsHandler()],
    [EVENTS.GET_VERSION, new GetVersionHandler()],
    [EVENTS.IN_APP_ERROR, new InAppErrorHandler()]
  ])

  logger.debug(appStore.path)

  await registerMenus({
    openLogFile: (file: string) => {
      openLogFileHandler.listen(file)
    }
  })

  registerIpcEvents(events)
}
