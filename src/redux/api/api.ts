import { ScriptModel } from '../../models'

class Api {
  compileScript = async (script: ScriptModel) => {
    return 'fake log'
  }
}

const api = new Api()

export default api
