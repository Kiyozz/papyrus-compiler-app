import React, { createContext, useContext } from 'react'

import type { Titlebar } from 'custom-electron-titlebar'

interface Context {
  titlebar: Titlebar
}

const TitlebarContext = createContext({} as Context)

export const useTitlebar = (): Context => useContext(TitlebarContext)

export function TitlebarProvider({
  children,
  titlebar,
}: React.PropsWithChildren<{ titlebar: Titlebar }>): JSX.Element {
  return (
    <TitlebarContext.Provider value={{ titlebar }}>
      {children}
    </TitlebarContext.Provider>
  )
}
