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
  useState,
} from 'react'

type _VersionContext = [string, Dispatch<SetStateAction<string>>]

const _Context = createContext(['', () => ''] as _VersionContext)

const VersionProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [version, setVersion] = useState('')

  return (
    <_Context.Provider value={[version, setVersion]}>
      {children}
    </_Context.Provider>
  )
}

export const useVersion = (): _VersionContext => useContext(_Context)

export default VersionProvider
