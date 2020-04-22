import React from 'react'
import { createContext, useContext } from 'react'
import { connect } from 'react-redux'
import { GroupModel, ScriptModel } from '../../models'
import { RootStore } from '../../redux/stores/root.store'

interface CompilationContextValue extends CompilationContextOwnProps {
  isCompilationRunning: boolean
  compilationScripts: ScriptModel[]
  popupOpen: boolean
  groups: GroupModel[]
}

interface CompilationContextOwnProps {
  hoveringScript: ScriptModel | undefined
}

export const CompilationContext = createContext({} as CompilationContextValue)

export const useCompilationContext = () => useContext(CompilationContext) as CompilationContextValue

const mapStateToProps = (store: RootStore, own: CompilationContextOwnProps): CompilationContextValue => ({
  compilationScripts: store.compilation.compilationScripts,
  isCompilationRunning: store.compilation.isCompilationRunning,
  groups: store.groups.groups,
  hoveringScript: own.hoveringScript,
  popupOpen: store.compilationLogs.popupOpen
})

const Provider: React.FC<CompilationContextValue> = ({ children, ...props}) => (
  <CompilationContext.Provider value={props}>
    {children}
  </CompilationContext.Provider>
)

const CompilationContextProvider = connect(mapStateToProps)(Provider)

export default CompilationContextProvider
