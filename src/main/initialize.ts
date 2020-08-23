import { EVENTS } from '@common'
import { is } from 'electron-util'
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
import { move, ensureFiles } from './services/path'
import { registerEvents } from './services/registerEvents'

const log = new Log('Initialize')

function installExtensions() {
  if (is.development) {
    const installer = require('electron-devtools-installer')
    const extensions = [installer.REACT_DEVELOPER_TOOLS, installer.REDUX_DEVTOOLS]

    return Promise.all(extensions.map(name => installer.default(name))).catch(e => log.log(e))
  }
}

async function backupLatestLogFile() {
  const logFile = log.transports.file.getFile().path

  if (!logFile) {
    log.info('There is no log file')

    return
  }

  log.info('A log file exists, creation of a new one')

  await ensureFiles([logFile])

  const logFilename = logFile.replace('.log', '')

  await move(logFile, `${logFilename}.1.log`, { overwrite: true })
  await ensureFiles([logFile])

  log.info(`file ${logFilename}.1.log created`)
}

export async function initialize() {
  await backupLatestLogFile()
  await installExtensions()

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
    openLogFile: (file: string) => {
      openLogFileHandler.listen(file)
    }
  })

  registerEvents(events)
}
