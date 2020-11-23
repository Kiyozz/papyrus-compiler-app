import * as path from 'path'
import is from '@sindresorhus/is'
import * as util from 'electron-util'
import { toAntiSlash, toSlash } from '../slash'
import { AppStore } from '../store'

export function migrate420(store: AppStore) {
  const gamePath = store.get('gamePath')

  if (is.nonEmptyString(gamePath)) {
    const compilerPath = store.get('compilerPath')
    const slashFunc = util.is.linux || util.is.macos ? toSlash : toAntiSlash

    store.set('compilerPath', slashFunc(path.join(gamePath, compilerPath)))
  }
}
