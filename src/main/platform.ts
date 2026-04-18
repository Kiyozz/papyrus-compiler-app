/*
 * 2026 Kiyozz.
 */

import { is } from 'electron-util'
import { release } from 'os'

export class Platform {
  current() {
    if (is.windows) return 'windows'
    if (is.linux) return 'linux'

    const isBigsur = parseInt(release().split('.')[0] ?? '0') >= 11

    if (isBigsur) return 'macos-bigsur'

    return 'macos'
  }
}
