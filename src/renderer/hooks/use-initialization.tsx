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
  useState,
} from 'react'
import { useDidMount } from 'rooks'

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
  children,
}: React.PropsWithChildren<unknown>): JSX.Element {
  const [done, setDone] = useState(false)
  const [latestVersion, setLatestVersion] = useState('')
  const { setShowChangelog, setChangelog, setCheckUsingLastVersion } = useApp()
  const [version, setVersion] = useVersion()

  const checkUpdates = useCallback(
    async (version: string) => {
      const response = await fetch(`${GITHUB_REPOSITORY}/releases`)
      const [release]: GithubRelease[] = await response.json()

      if (typeof release !== 'undefined' && version.length !== 0) {
        if (compareVersions.compare(release.tag_name, version, '>')) {
          setLatestVersion(release.tag_name)
          setShowChangelog(true)
          setChangelog(release.body)

          return true
        } else {
          setShowChangelog(false)
        }
      }

      return false
    },
    [setChangelog, setShowChangelog],
  )

  useDidMount(() => {
    bridge.version.get().then(async v => {
      setVersion(v)
      setDone(true)

      await checkUpdates(v)
    })
  })

  useEffect(() => {
    const check = async () => {
      const foundNewVersion = await checkUpdates(version)

      if (!foundNewVersion) {
        setCheckUsingLastVersion(true)
      }
    }

    bridge.changelog.on(check)

    return () => bridge.changelog.off(check)
  }, [checkUpdates, setCheckUsingLastVersion, version])
  return (
    <InitializationContext.Provider value={{ done, latestVersion }}>
      {children}
    </InitializationContext.Provider>
  )
}
