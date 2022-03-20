/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react'

const Context = createContext<boolean>(true)

const hasFocus = () => document.hasFocus()

const FocusProvider = ({ children }: PropsWithChildren<unknown>) => {
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
