/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'

const FocusContext = createContext(true)

const hasFocus = () => document.hasFocus()

export const useFocus = (): boolean => useContext(FocusContext)

export const FocusProvider = ({
  children
}: React.PropsWithChildren<unknown>): JSX.Element => {
  const [isFocus, setFocus] = useState(hasFocus)

  useEffect(() => {
    const onBlur = () => {
      setFocus(false)
    }

    const onFocus = () => {
      setFocus(true)
    }

    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)

    return () => {
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
    }
  }, [])

  return (
    <FocusContext.Provider value={isFocus}>{children}</FocusContext.Provider>
  )
}
