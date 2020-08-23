import is from '@sindresorhus/is'
import { HandlerInterface } from '../HandlerInterface'
import { compile } from '../services/compile'
import Log from '../services/Log'

export class CompileScriptHandler implements HandlerInterface<string> {
  private readonly log = new Log('CompilerScriptHandler')

  async listen(script?: string) {
    if (is.undefined(script)) {
      throw new TypeError('Missing script parameter')
    }

    this.log.info('Started compilation for script:', script)

    const result = await compile(script)

    this.log.info(`Script ${script} successfully compiled.`, result)

    return result
  }
}
