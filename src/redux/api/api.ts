import { GithubReleaseModel, ScriptModel } from '../../models'

class Api {
  compileScript = async (script: ScriptModel) => {
    return 'fake log'
  }

  getLatestNotes = async () => {
    const response = await fetch('https://api.github.com/repos/Kiyozz/papyrus-compiler-app/releases/latest')

    return await response.json() as Promise<GithubReleaseModel>
  }
}

const api = new Api()

export default api
