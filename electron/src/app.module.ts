import { Module } from '@nestjs/common'
import { CompileScriptHandler } from './event-handlers/compile-script.handler'
import { Mo2Handler } from './event-handlers/mo2.handler'
import GameHelper from './helpers/game.helper'
import PathHelper from './helpers/path.helper'
import { EventHandlerParser } from './services/event-handler-parser'

@Module({
  providers: [
    EventHandlerParser,
    GameHelper,
    PathHelper,
    CompileScriptHandler,
    Mo2Handler,
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
