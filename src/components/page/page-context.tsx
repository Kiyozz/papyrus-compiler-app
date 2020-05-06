import React from 'react'

interface PageContextInterface {
  open: boolean
  setOpen: (open: boolean) => void
}

const PageContext = React.createContext({} as PageContextInterface)

export const usePageContext = () => React.useContext(PageContext)

const PageContextProvider: React.FC = ({ children }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <PageContext.Provider value={{ open, setOpen }}>
      {children}
    </PageContext.Provider>
  )
}

export default PageContextProvider
