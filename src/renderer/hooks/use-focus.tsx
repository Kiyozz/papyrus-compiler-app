/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'

type _FocusContext = boolean

const _Context = createContext<_FocusContext>(true)

const hasFocus = () => document.hasFocus()

const FocusProvider = ({ children }: React.PropsWithChildren<unknown>) => {
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

  return <_Context.Provider value={isFocus}>{children}</_Context.Provider>
}

export const useFocus = (): boolean => useContext(_Context)

export default FocusProvider
