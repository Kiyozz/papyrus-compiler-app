/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext
} from 'react'
import useLocalStorage from 'react-use-localstorage'

import { LocalStorage } from '../enums/local-storage.enum'

type Context = [boolean, Dispatch<SetStateAction<boolean>>]

const DrawerContext = createContext([true, () => true] as Context)

export function DrawerProvider({
  children
}: React.PropsWithChildren<unknown>): JSX.Element {
  const [isDrawerExpandLS, setDrawerExpandLS] = useLocalStorage(
    LocalStorage.DrawerExpand,
    'false'
  )

  return (
    <DrawerContext.Provider
      value={[
        isDrawerExpandLS === 'true',
        v => {
          if (is.function_(v)) {
            setDrawerExpandLS(`${v(isDrawerExpandLS === 'true')}`)
          } else {
            setDrawerExpandLS(`${v}`)
          }
        }
      ]}
    >
      {children}
    </DrawerContext.Provider>
  )
}

export const useDrawer = (): Context => useContext(DrawerContext)
