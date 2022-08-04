/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import is from '@sindresorhus/is'
import React, { createContext, useContext } from 'react'
import useLocalStorage from 'react-use-localstorage'
import { LocalStorage } from '../enums/local-storage.enum'
import type { Dispatch, SetStateAction } from 'react'

type DrawerContext = [boolean, Dispatch<SetStateAction<boolean>>]

const Context = createContext([true, () => true] as DrawerContext)

function DrawerProvider({ children }: React.PropsWithChildren) {
  const [isDrawerExpandLS, setDrawerExpandLS] = useLocalStorage(
    LocalStorage.drawerExpand,
    'false',
  )

  return (
    <Context.Provider
      value={[
        isDrawerExpandLS === 'true',
        v => {
          if (is.function_(v)) {
            setDrawerExpandLS(`${v(isDrawerExpandLS === 'true').toString()}`)
          } else {
            setDrawerExpandLS(`${v.toString()}`)
          }
        },
      ]}
    >
      {children}
    </Context.Provider>
  )
}

export const useDrawer = (): DrawerContext => useContext(Context)

export default DrawerProvider
