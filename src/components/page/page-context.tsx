import React, { useState, useContext } from 'react'
import DropFilesOverlay from '../drop-files-overlay/drop-files-overlay'
import DropScripts, { OnDropFunction } from '../drop-scripts/drop-scripts'

interface PageContextInterface {
  drawerOpen: boolean
  setDrawerOpen: (open: boolean) => void
  setOnDrop: (on: (() => OnDropFunction) | null) => void
  addScriptsButton?: JSX.Element
  setAddScriptsButton: (button: JSX.Element | null) => void
  isDragActive: boolean
}

const PageContext = React.createContext({} as PageContextInterface)

export const usePageContext = () => useContext(PageContext)

const PageContextProvider: React.FC = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [onDrop, setOnDrop] = useState<OnDropFunction | null>(null)
  const [AddScriptsButton, setAddScriptsButton] = useState<JSX.Element | null>(null)

  return (
    <DropScripts accept=".psc" onlyClickButton onDrop={onDrop} Button={AddScriptsButton}>
      {({ Button, isDragActive }) => (
        <PageContext.Provider value={{ drawerOpen, setDrawerOpen, addScriptsButton: Button, isDragActive, setOnDrop, setAddScriptsButton }}>
          <DropFilesOverlay open={isDragActive && onDrop !== null} />

          {children}
        </PageContext.Provider>
      )}
    </DropScripts>
  )
}

export default PageContextProvider
