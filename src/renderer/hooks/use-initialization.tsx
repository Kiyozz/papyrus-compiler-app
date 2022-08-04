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
import { bridge } from '../bridge'
import { useApp } from './use-app'
import { useVersion } from './use-version'
import type { GithubRelease } from '../types'

const GITHUB_REPOSITORY =
  'https://api.github.com/repos/Kiyozz/papyrus-compiler-app'

interface InitializationContext {
  latestVersion?: string
  done: boolean
}

type CheckUpdateReturn =
  | false
  | {
      latestVersion: string
      changelogs: string
    }

const Context = createContext({} as InitializationContext)

function InitializationProvider({ children }: React.PropsWithChildren) {
  const [done, setDone] = useState(false)
  const [latestVersion, setLatestVersion] = useState<string | undefined>()
  const {
    showChangelogs: [, setShowChangelogs],
    changelogs: [, setChangelogs],
    showLatestVersionAlert: [, setShowLatestVersionAlert],
  } = useApp()
  const [version, setVersion] = useVersion()

  const checkUpdates = useCallback(
    async (checkForVersion: string): Promise<CheckUpdateReturn> => {
      const response = await fetch(`${GITHUB_REPOSITORY}/releases?per_page=1`)
      const [release] = (await response.json()) as GithubRelease[]

      if (typeof release !== 'undefined' && checkForVersion.length !== 0) {
        if (compare(release.tag_name, checkForVersion, '>')) {
          return {
            latestVersion: release.tag_name,
            changelogs: release.body,
          }
        }
      }

      return false
    },
    [],
  )

  useDidMount(async () => {
    const v = await bridge.getVersion()

    setVersion(v)
    setDone(true)

    const payload = await checkUpdates(v)

    if (payload) {
      setChangelogs(payload.changelogs)
      setLatestVersion(payload.latestVersion)
      setShowChangelogs(true)
    }
  })

  // TODO: move using useIpc
  useEffect(() => {
    const check = async () => {
      const payload = await checkUpdates(version)

      if (!payload) {
        setShowLatestVersionAlert(true)
      } else {
        setLatestVersion(payload.latestVersion)
        setChangelogs(payload.changelogs)
        setShowChangelogs(true)
        setShowLatestVersionAlert(false)
      }
    }

    bridge.changelog.on(check)

    return () => bridge.changelog.off(check)
  }, [
    checkUpdates,
    setChangelogs,
    setShowChangelogs,
    setShowLatestVersionAlert,
    version,
  ])

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
