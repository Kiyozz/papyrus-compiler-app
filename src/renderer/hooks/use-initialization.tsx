/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import { compare } from 'compare-versions'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useDidMount } from 'rooks'

import bridge from '../bridge'
import { GithubRelease } from '../types'
import { useApp } from './use-app'
import { useVersion } from './use-version'

const GITHUB_REPOSITORY =
  'https://api.github.com/repos/Kiyozz/papyrus-compiler-app'

type InitializationContext = {
  latestVersion: string
  done: boolean
}

const Context = createContext({} as InitializationContext)

const InitializationProvider = ({
  children,
}: React.PropsWithChildren<unknown>) => {
  const [done, setDone] = useState(false)
  const [latestVersion, setLatestVersion] = useState('')
  const { setShowChangelog, setChangelog, setCheckUsingLastVersion } = useApp()
  const [version, setVersion] = useVersion()

  const checkUpdates = useCallback(
    async (version: string) => {
      const response = await fetch(`${GITHUB_REPOSITORY}/releases?per_page=1`)
      const [release]: GithubRelease[] = await response.json()

      if (typeof release !== 'undefined' && version.length !== 0) {
        if (compare(release.tag_name, version, '>')) {
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
    bridge.getVersion().then(async v => {
      setVersion(v)
      setDone(true)

      await checkUpdates(v)
    })
  })

  // TODO: move using useIpc
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
    <Context.Provider value={{ done, latestVersion }}>
      {children}
    </Context.Provider>
  )
}

export const useInitialization = (): InitializationContext => {
  return useContext(Context)
}

export default InitializationProvider
