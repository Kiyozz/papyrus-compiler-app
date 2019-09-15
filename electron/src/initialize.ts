import { CompileScriptHandler } from './event-handlers/compile-script.handler'
import { Mo2Handler } from './event-handlers/mo2.handler'

export class Initialize {
  public static main() {
    Initialize.registerEventHandlers()
  }

  private static registerEventHandlers() {
    CompileScriptHandler.register()
    Mo2Handler.register()
  }
}
