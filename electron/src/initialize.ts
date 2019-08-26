import { CompileScriptHandler } from './event-handlers/compile-script.handler'

export class Initialize {
  public static main() {
    Initialize.registerEventHandlers()
  }

  private static registerEventHandlers() {
    CompileScriptHandler.register()
  }
}
