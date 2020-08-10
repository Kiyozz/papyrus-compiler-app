import log from 'electron-log'
import fs from 'fs-extra'
import { CompileScriptHandler } from './event-handlers/compile-script.handler'
import { DialogHandler } from './event-handlers/dialog.handler'
import { GetFileHandler } from './event-handlers/file.handler'
import { LogHandler } from './event-handlers/log.handler'
import { Mo2Handler } from './event-handlers/mo2.handler'
import { PathHelper } from './helpers/path.helper'
import { IpcEventHandlerParser } from './services/ipc-event-handler-parser'
import { LogService } from './services/log.service'
import { Mo2Service } from './services/mo2.service'
import { PapyrusCompilerService } from './services/papyrus-compiler.service'
import { ShellService } from './services/shell.service'

async function backupLatestLogFile() {
  const logFile = log.transports.file.getFile().path

  if (!logFile) {
    return
  }

  await fs.ensureFile(logFile)
  await fs.copy(logFile, `${logFile.replace('.log', '')}.1.log`)
}

export async function initialize() {
  await backupLatestLogFile()

  const logService = new LogService()
  const pathHelper = new PathHelper(logService)
  const shellService = new ShellService(logService)
  const papyrusCompilerService = new PapyrusCompilerService()
  const mo2Service = new Mo2Service(pathHelper)

  const parser = new IpcEventHandlerParser(
    [
      new CompileScriptHandler(pathHelper, shellService, papyrusCompilerService, mo2Service, logService),
      new LogHandler(),
      new Mo2Handler(pathHelper)
    ],
    [new GetFileHandler(logService, pathHelper), new DialogHandler()],
    logService
  )

  parser.register()
}
