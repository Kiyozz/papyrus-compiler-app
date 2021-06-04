/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import type { Titlebar } from 'custom-electron-titlebar'
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

interface Context {
  titlebar: Titlebar
  isOpen: boolean
}

const TitlebarContext = createContext({} as Context)

export const useTitlebar = (): Context => useContext(TitlebarContext)

export function TitlebarProvider({
  children,
  titlebar,
}: React.PropsWithChildren<{ titlebar: Titlebar }>): JSX.Element {
  const [isTitlebarOpen, setTitlebarOpen] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timer | null = null
    const titlebarElem = document.querySelector('.menubar')
    const onHover = () => {
      console.log('hover')
      setTitlebarOpen(true)
    }
    const onLeave = () => {
      if (timer !== null) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        console.log('leave')
        setTitlebarOpen(false)
      }, 2000)
    }

    titlebarElem?.addEventListener('mouseenter', onHover)
    titlebarElem?.addEventListener('mouseleave', onLeave)

    return () => {
      titlebarElem?.removeEventListener('mouseenter', onHover)
      titlebarElem?.removeEventListener('mouseleave', onLeave)

      if (timer) {
        clearTimeout(timer)
      }
    }
  }, [])

  const value = useMemo(
    () => ({ titlebar, isOpen: isTitlebarOpen } as Context),
    [isTitlebarOpen, titlebar],
  )

  return (
    <TitlebarContext.Provider value={value}>
      {children}
    </TitlebarContext.Provider>
  )
}
