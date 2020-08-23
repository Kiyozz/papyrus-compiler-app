import { EVENTS } from '@common'
import appStore from '../common/appStore'
import { BadInstallationHandler } from './event-handlers/BadInstallationHandler'
import { CompileScriptHandler } from './event-handlers/CompileScriptHandler'
import ConfigGetHandler from './event-handlers/ConfigGetHandler'
import ConfigUpdateHandler from './event-handlers/ConfigUpdateHandler'
import { DialogHandler } from './event-handlers/DialogHandler'
import { FilesStatsHandler } from './event-handlers/FilesStatsHandler'
import { GetVersionHandler } from './event-handlers/GetVersionHandler'
import { InAppErrorHandler } from './event-handlers/InAppErrorHandler'
import { Mo2ModsSourcesHandler } from './event-handlers/Mo2ModsSourcesHandler'
import { OpenLogFileHandler } from './event-handlers/OpenLogFileHandler'
import { HandlerInterface } from './HandlerInterface'
import { registerMenus } from './registerMenus'
import Log from './services/Log'
import { copy, ensureFiles } from './services/path'
import { registerEvents } from './services/registerEvents'

const log = new Log('Initialize')

async function backupLatestLogFile() {
  const logFile = log.transports.file.getFile().path

  if (!logFile) {
    log.info('There is no log file')

    return
  }

  log.info('A log file exists, creation of a new one')

  await ensureFiles([logFile])

  const logFilename = logFile.replace('.log', '')

  await copy(logFile, `${logFilename}.1.log`)

  log.info(`file ${logFilename}.1.log created`)
}

export async function initialize() {
  await backupLatestLogFile()

  const openLogFileHandler = new OpenLogFileHandler()
  const events = new Map<string, HandlerInterface>([
    [EVENTS.COMPILE_SCRIPT, new CompileScriptHandler()],
    [EVENTS.OPEN_DIALOG, new DialogHandler()],
    [EVENTS.MO2_MODS_SOURCES, new Mo2ModsSourcesHandler()],
    [EVENTS.BAD_INSTALLATION, new BadInstallationHandler()],
    [EVENTS.CONFIG_UPDATE, new ConfigUpdateHandler()],
    [EVENTS.CONFIG_GET, new ConfigGetHandler()],
    [EVENTS.FILES_STATS, new FilesStatsHandler()],
    [EVENTS.GET_VERSION, new GetVersionHandler()],
    [EVENTS.IN_APP_ERROR, new InAppErrorHandler()]
  ])

  log.log(appStore.path)

  registerMenus({
    openLogFile: () => {
      openLogFileHandler.listen()
    }
  })

  registerEvents(events)
}
