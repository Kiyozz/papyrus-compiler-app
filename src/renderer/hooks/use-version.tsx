/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, {
  createContext,
  useContext,
  useState,
} from 'react'
import type {
  Dispatch,
  SetStateAction} from 'react';

type _VersionContext = [string, Dispatch<SetStateAction<string>>]

const _Context = createContext(['', () => ''] as _VersionContext)

function VersionProvider({ children }: React.PropsWithChildren<unknown>) {
  const [version, setVersion] = useState('')

  return (
    <_Context.Provider value={[version, setVersion]}>
      {children}
    </_Context.Provider>
  )
}

export const useVersion = (): _VersionContext => useContext(_Context)

export default VersionProvider
