/* eslint-disable react-hooks/exhaustive-deps */

/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'

import { DropFilesOverlay } from '../components/drop/drop-files-overlay'
import { DropScripts, OnDropFunction } from '../components/drop/drop-scripts'

interface Context {
  onDrop: OnDropFunction | null
  setOnDrop: (on: (() => OnDropFunction) | null) => void
  drop: () => void
  isDragActive: boolean
}

const DropContext = createContext({} as Context)

export const useDrop = (): Context => useContext(DropContext)

export const useSetDrop = (on: OnDropFunction | null): void => {
  const { setOnDrop } = useDrop()

  useEffect(() => {
    setOnDrop(() => on)

    return () => setOnDrop(null)
  }, [on, setOnDrop])
}

export function DropProvider({
  children,
}: React.PropsWithChildren<unknown>): JSX.Element {
  const [onDrop, setOnDrop] = useState<OnDropFunction | null>(null)

  return (
    <DropScripts onDrop={onDrop}>
      {({ isDragActive, open }) => (
        <DropContext.Provider
          value={{
            isDragActive,
            drop: open,
            onDrop,
            setOnDrop,
          }}
        >
          <DropFilesOverlay open={isDragActive && onDrop !== null} />
          {children}
        </DropContext.Provider>
      )}
    </DropScripts>
  )
}
