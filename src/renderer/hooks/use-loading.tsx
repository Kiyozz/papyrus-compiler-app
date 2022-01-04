/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { createContext, useContext, useState } from 'react'

type LoadingContextInterface = {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextInterface>({
  isLoading: false,
} as LoadingContextInterface)

const LoadingProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [isLoading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = (): LoadingContextInterface => {
  return useContext(LoadingContext)
}

export default LoadingProvider
