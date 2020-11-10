import is from '@sindresorhus/is'
import { EventHandler } from '../EventHandler'
import { compileScript } from '../services/compileScript'
import { Logger } from '../Logger'
import { storeCheck } from '@pca/common/storeCheck'
import { appStore, defaultConfig } from '@pca/common/store'

export class ScriptCompileHandler implements EventHandler<string> {
  private readonly log = new Logger('ScriptCompileHandler')

  async listen(script?: string) {
    if (is.undefined(script)) {
      throw new TypeError('Missing script parameter')
    }

    this.log.info('Started compilation for script:', script)

    storeCheck(appStore, defaultConfig)

    const result = await compileScript(script)

    this.log.info(`Script ${script} successfully compiled.`, result)

    return result
  }
}
