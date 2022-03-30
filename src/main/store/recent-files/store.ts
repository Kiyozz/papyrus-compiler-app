/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import Store from 'electron-store'
import { uniqArray } from '../../../common/uniq-array'
import type { RecentFiles } from '../../../common/types/recent-files'
import type { Script } from '../../../common/types/script'

const defaultRecentFiles: RecentFiles = {
  files: [] as Script[],
}

class RecentFileStore extends Store<RecentFiles> {
  constructor() {
    super({
      name: 'recent_files',
      defaults: defaultRecentFiles,
    })
  }

  get files(): Script[] {
    return this.get('files')
  }

  set files(scripts: Script[]) {
    const currentScripts = this.files

    const uniq = uniqArray([...scripts, ...currentScripts].slice(0, 30), [
      'path',
    ])

    this.set('files', uniq)
  }

  clearFiles(): void {
    this.set('files', [])
  }

  removeFile(script: Script): void {
    const currentScripts = this.files

    this.set(
      'files',
      currentScripts.filter(s => s.path !== script.path),
    )
  }
}

const recentFilesStore = new RecentFileStore()

export { recentFilesStore, defaultRecentFiles }
