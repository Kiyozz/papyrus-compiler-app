/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import { Stats } from 'fs'

import { EventHandler } from '../interfaces/event-handler'
import { Logger } from '../logger'
import { stat } from '../path/path'

export class FileStatHandler implements EventHandler<string[]> {
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
      }),
    )

    stats.forEach(({ stat: fileStat, file }) => {
      map.set(file, fileStat)
    })

    return map
  }
}
