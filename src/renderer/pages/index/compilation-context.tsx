/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { createContext, useContext } from 'react'
import { ScriptInterface } from '../../interfaces'
import { useStoreSelector } from '../../redux/use-store-selector'

interface CompilationContextValue {
  isCompilationRunning: boolean
  compilationScripts: ScriptInterface[]
  popupOpen: boolean
}

export const CompilationContext = createContext({} as CompilationContextValue)

export const useCompilationContext = () =>
  useContext(CompilationContext) as CompilationContextValue

function Provider({ children }: React.PropsWithChildren<unknown>) {
  const contextValue = useStoreSelector(store => ({
    compilationScripts: store.compilation.compilationScripts,
    isCompilationRunning: store.compilation.isCompilationRunning,
    popupOpen: store.compilationLogs.popupOpen
  }))

  return (
    <CompilationContext.Provider value={contextValue}>
      {children}
    </CompilationContext.Provider>
  )
}

export const CompilationContextProvider = Provider
