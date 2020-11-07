import is from '@sindresorhus/is'
import { HandlerInterface } from '../HandlerInterface'
import { Stats } from '@common/interfaces/Stats'
import { stat } from '../services/path'

export class FilesStatsHandler implements HandlerInterface<string[]> {
  async listen(files?: string[]): Promise<Map<string, Stats>> {
    if (is.undefined(files)) {
      throw new TypeError('"files" is undefined.')
    }

    const map = new Map<string, Stats>()

    const stats = await Promise.all(
      files.map(async file => {
        return { file, stat: await stat(file) }
      })
    )

    stats.forEach(({ stat: fileStat, file }) => {
      map.set(file, fileStat)
    })

    return map
  }
}
