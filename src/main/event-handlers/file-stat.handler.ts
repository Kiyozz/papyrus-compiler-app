/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { Stats } from 'fs'
import is from '@sindresorhus/is'
import { EventHandlerInterface } from '../interfaces/event-handler.interface'
import { stat } from '../services/path.service'
import { Logger } from '../logger'

export class FileStatHandler implements EventHandlerInterface<string[]> {
  private logger = new Logger('FileStatHandler')

  async listen(files?: string[]): Promise<Map<string, Stats>> {
    this.logger.debug('getting stat of', files)

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
