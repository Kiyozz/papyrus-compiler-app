/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { PropsWithChildren } from 'react'

const Context = createContext<boolean>(true)

const hasFocus = () => document.hasFocus()

function FocusProvider({ children }: PropsWithChildren) {
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

  return <Context.Provider value={isFocus}>{children}</Context.Provider>
}

export const useFocus = (): boolean => useContext(Context)

export default FocusProvider
