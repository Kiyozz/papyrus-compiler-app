import React, { createContext, useContext } from 'react'
import { ScriptModel } from '../../models'
import { useStoreSelector } from '../../redux/use-store-selector'

interface CompilationContextValue extends CompilationContextOwnProps {
  isCompilationRunning: boolean
  compilationScripts: ScriptModel[]
  popupOpen: boolean
}

interface CompilationContextOwnProps {
  hoveringScript: ScriptModel | undefined
}

export const CompilationContext = createContext({} as CompilationContextValue)

export const useCompilationContext = () =>
  useContext(CompilationContext) as CompilationContextValue

const Provider: React.FC<CompilationContextOwnProps> = ({
  children,
  ...own
}) => {
  const contextValue = useStoreSelector(store => ({
    compilationScripts: store.compilation.compilationScripts,
    isCompilationRunning: store.compilation.isCompilationRunning,
    hoveringScript: own.hoveringScript,
    popupOpen: store.compilationLogs.popupOpen
  }))

  return (
    <CompilationContext.Provider value={contextValue}>
      {children}
    </CompilationContext.Provider>
  )
}

// noinspection UnnecessaryLocalVariableJS
const CompilationContextProvider = Provider

export default CompilationContextProvider
