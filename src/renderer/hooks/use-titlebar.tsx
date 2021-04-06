/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Titlebar } from 'custom-electron-titlebar'
import React, { createContext, useContext, useEffect } from 'react'

import { useVersion } from './use-version'

interface TitlebarContextInterface {
  titlebar: Titlebar
}

const TitlebarContext = createContext<TitlebarContextInterface>(
  {} as TitlebarContextInterface
)

export function useTitlebar(): TitlebarContextInterface {
  return useContext(TitlebarContext)
}

export function TitlebarProvider({
  children,
  titlebar
}: React.PropsWithChildren<{ titlebar: Titlebar }>): JSX.Element {
  const [version] = useVersion()

  useEffect(() => {
    titlebar.updateTitle(`PCA ${version}`)
  }, [titlebar, version])

  return (
    <TitlebarContext.Provider value={{ titlebar }}>
      {children}
    </TitlebarContext.Provider>
  )
}
