import { Module } from '@nestjs/common'
import { CompileScriptHandler } from './event-handlers/compile-script.handler'
import { DialogHandler } from './event-handlers/dialog.handler'
import { GetFileHandler } from './event-handlers/file.handler'
import { LogHandler } from './event-handlers/log.handler'
import { Mo2Handler } from './event-handlers/mo2.handler'
import { GameHelper } from './helpers/game.helper'
import { PathHelper } from './helpers/path.helper'
import { EventHandlerParser } from './services/event-handler-parser'
import { LogService } from './services/log.service'
import { Mo2Service } from './services/mo2.service'
import { PapyrusCompilerService } from './services/papyrus-compiler.service'
import { ShellService } from './services/shell.service'

@Module({
  providers: [
    EventHandlerParser,
    GameHelper,
    PathHelper,
    CompileScriptHandler,
    GetFileHandler,
    Mo2Handler,
    LogHandler,
    DialogHandler,
    LogService,
    Mo2Service,
    PapyrusCompilerService,
    ShellService,
    {
      provide: 'HANDLERS',
      useFactory: (...handlers) => {
        return handlers
      },
      inject: [LogHandler, CompileScriptHandler, Mo2Handler]
    },
    {
      provide: 'HANDLERS_INVOKE',
      useFactory: (...handlers) => {
        return handlers
      },
      inject: [GetFileHandler, DialogHandler]
    }
  ]
})
export class AppModule {}
