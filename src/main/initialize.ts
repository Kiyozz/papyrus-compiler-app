import * as EVENTS from '../common/events'
import { is } from 'electron-util'
import { appStore } from '../common/store'
import { BadInstallationHandler } from './event-handlers/bad-installation.handler'
import { ScriptCompileHandler } from './event-handlers/script-compile.handler'
import { ConfigGetHandler } from './event-handlers/config-get.handler'
import { ConfigUpdateHandler } from './event-handlers/config-update.handler'
import { DialogHandler } from './event-handlers/dialog.handler'
import { FileStatHandler } from './event-handlers/file-stat.handler'
import { GetVersionHandler } from './event-handlers/get-version.handler'
import { InAppErrorHandler } from './event-handlers/in-app-error.handler'
import { Mo2ModsSourcesHandler } from './event-handlers/mo2-mods-sources.handler'
import { OpenFileHandler } from './event-handlers/open-file.handler'
import { IsProductionHandler } from './event-handlers/is-production.handler'
import { EventHandler } from './interfaces/event.handler'
import { registerMenu } from './menu.register'
import { Logger } from './logger'
import { ensureFiles, move } from './services/path.service'
import { registerIpcEvents } from './ipc-events.register'

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
    ).catch(e => logger.warn(e))
  }
}

/**
 * Rename the current log file to have previous session log file
 */
async function backupLogFile() {
  const logFile = logger.transports.file.getFile().path

  if (!logFile) {
    logger.info('there is no log file')

    return
  }

  logger.info('a log file already exists, creation of a new one')

  await ensureFiles([logFile])

  const logFilename = logFile.replace('.log', '')

  await move(logFile, `${logFilename}.1.log`, { overwrite: true })
  await ensureFiles([logFile])

  logger.info(`file ${logFilename}.1.log created`)
}

export async function initialize() {
  await backupLogFile()
  await installExtensions()

  const openFileHandler = new OpenFileHandler()
  const events = new Map<string, EventHandler>([
    [EVENTS.COMPILE_SCRIPT, new ScriptCompileHandler()],
    [EVENTS.OPEN_DIALOG, new DialogHandler()],
    [EVENTS.MO2_MODS_SOURCES, new Mo2ModsSourcesHandler()],
    [EVENTS.BAD_INSTALLATION, new BadInstallationHandler()],
    [EVENTS.CONFIG_UPDATE, new ConfigUpdateHandler()],
    [EVENTS.CONFIG_GET, new ConfigGetHandler()],
    [EVENTS.FILES_STATS, new FileStatHandler()],
    [EVENTS.GET_VERSION, new GetVersionHandler()],
    [EVENTS.IN_APP_ERROR, new InAppErrorHandler()],
    [EVENTS.IS_PRODUCTION, new IsProductionHandler()]
  ])

  logger.debug(appStore.path)

  await registerMenu({
    openLogFile: (file: string) => {
      openFileHandler.listen(file)
    }
  })

  registerIpcEvents(events)
}
