/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { createContext, useContext, useState } from 'react'

interface LoadingContextInterface {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const LoadingContext = createContext<LoadingContextInterface>({
  isLoading: false
} as LoadingContextInterface)

export function useLoading(): LoadingContextInterface {
  return useContext(LoadingContext)
}

export function LoadingProvider({
  children
}: React.PropsWithChildren<unknown>): JSX.Element {
  const [isLoading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}
