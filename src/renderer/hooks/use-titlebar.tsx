import type { Titlebar } from 'custom-electron-titlebar'
import React, { createContext, useContext } from 'react'

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
