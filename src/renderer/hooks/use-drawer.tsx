/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react'
import useLocalStorage from 'react-use-localstorage'

import { LocalStorage } from '../enums/local-storage.enum'

type _DrawerContext = [boolean, Dispatch<SetStateAction<boolean>>]

const _Context = createContext([true, () => true] as _DrawerContext)

const DrawerProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [isDrawerExpandLS, setDrawerExpandLS] = useLocalStorage(
    LocalStorage.drawerExpand,
    'false',
  )

  return (
    <_Context.Provider
      value={[
        isDrawerExpandLS === 'true',
        v => {
          if (is.function_(v)) {
            setDrawerExpandLS(`${v(isDrawerExpandLS === 'true')}`)
          } else {
            setDrawerExpandLS(`${v}`)
          }
        },
      ]}
    >
      {children}
    </_Context.Provider>
  )
}

export const useDrawer = (): _DrawerContext => useContext(_Context)

export default DrawerProvider
