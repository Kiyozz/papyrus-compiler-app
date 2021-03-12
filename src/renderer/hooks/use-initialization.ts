/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import compareVersions from 'compare-versions'
import { useCallback, useEffect, useState } from 'react'

import { Events } from '../../common/events'
import { ipcRenderer } from '../../common/ipc'
import { GithubRelease } from '../interfaces'
import { useApp } from './use-app'

interface Result {
  done: boolean
}

const GITHUB_REPOSITORY =
  'https://api.github.com/repos/Kiyozz/papyrus-compiler-app'

export function useInitialization(): Result {
  const [done, setDone] = useState(false)
  const {
    setVersion,
    setLatestVersion,
    setShowChangelog,
    setChangelog
  } = useApp()

  const checkUpdates = useCallback(() => {
    ipcRenderer.invoke<string>(Events.GetVersion).then(async version => {
      setVersion(version)
      const response = await fetch(`${GITHUB_REPOSITORY}/releases`)
      const [release]: GithubRelease[] = await response.json()

      if (typeof release !== 'undefined') {
        if (compareVersions.compare(release.tag_name, version, '>')) {
          setLatestVersion(release.tag_name)
          setShowChangelog(true)
          setChangelog(release.body)
        } else {
          setShowChangelog(false)
        }
      }

      setDone(true)
    })
  }, [setChangelog, setLatestVersion, setShowChangelog, setVersion])

  useEffect(() => {
    checkUpdates()
  }, [checkUpdates])

  useEffect(() => {
    ipcRenderer.on(Events.Changelog, checkUpdates)

    return () => ipcRenderer.off(Events.Changelog, checkUpdates)
  }, [checkUpdates])

  return {
    done
  }
}
