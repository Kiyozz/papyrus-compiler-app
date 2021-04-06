/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState
} from 'react'

type Context = [string, Dispatch<SetStateAction<string>>]

const VersionContext = createContext(['', () => ''] as Context)

export const useVersion = (): Context => useContext(VersionContext)

export function VersionProvider({
  children
}: React.PropsWithChildren<unknown>): JSX.Element {
  const [version, setVersion] = useState('')

  return (
    <VersionContext.Provider value={[version, setVersion]}>
      {children}
    </VersionContext.Provider>
  )
}
