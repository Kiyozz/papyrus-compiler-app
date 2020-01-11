import { Module } from '@nestjs/common'
import { CompileScriptHandler } from './event-handlers/compile-script.handler'
import { Mo2Handler } from './event-handlers/mo2.handler'
import GameHelper from './helpers/game.helper'
import PathHelper from './helpers/path.helper'
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
    Mo2Handler,
    LogService,
    Mo2Service,
    PapyrusCompilerService,
    ShellService,
    {
      provide: 'HANDLERS',
      useFactory: (...handlers) => {
        return handlers
      },
      inject: [CompileScriptHandler, Mo2Handler]
    }
  ]
})
export class AppModule {}
