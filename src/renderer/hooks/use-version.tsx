/*
 * 2022-2026 Kiyozz.
 */

import React, { createContext, useContext, useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'

type VersionContext = [string, Dispatch<SetStateAction<string>>]

const Context = createContext(['', () => ''] as VersionContext)

function VersionProvider({ children }: React.PropsWithChildren) {
  const [version, setVersion] = useState('')

  return (
    <Context.Provider value={[version, setVersion]}>
      {children}
    </Context.Provider>
  )
}

export const useVersion = (): VersionContext => useContext(Context)

export default VersionProvider
