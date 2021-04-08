/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import compareVersions from 'compare-versions'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

import bridge from '../bridge'
import { GithubRelease } from '../interfaces'
import { useApp } from './use-app'
import { useVersion } from './use-version'

const GITHUB_REPOSITORY =
  'https://api.github.com/repos/Kiyozz/papyrus-compiler-app'

interface Context {
  latestVersion: string
  done: boolean
}

const InitializationContext = createContext({} as Context)

export const useInitialization = (): Context =>
  useContext(InitializationContext)

export function InitializationProvider({
  children
}: React.PropsWithChildren<unknown>): JSX.Element {
  const [done, setDone] = useState(false)
  const [latestVersion, setLatestVersion] = useState('')
  const { setShowChangelog, setChangelog } = useApp()
  const [, setVersion] = useVersion()

  const checkUpdates = useCallback(() => {
    bridge.version.get().then(async version => {
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
    bridge.changelog.on(checkUpdates)

    return () => bridge.changelog.off(checkUpdates)
  }, [checkUpdates])
  return (
    <InitializationContext.Provider value={{ done, latestVersion }}>
      {children}
    </InitializationContext.Provider>
  )
}
