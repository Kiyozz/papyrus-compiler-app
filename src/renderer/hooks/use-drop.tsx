/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import DropScripts from '../components/drop/drop-scripts'
import type { OnDrop } from '../components/drop/drop-scripts'

interface DropContext {
  onDrop: OnDrop | null
  setOnDrop: (on: (() => OnDrop) | null) => void
  drop: () => void
  isDragActive: boolean
  isFileDialogActive: boolean
}

const Context = createContext({} as DropContext)

function DropProvider({ children }: React.PropsWithChildren) {
  const [onDrop, setOnDrop] = useState<OnDrop | null>(null)
  const [isFileDialogActive, setFileDialogActive] = useState(false)

  return (
    <DropScripts
      onDrop={files => {
        onDrop?.(files)
        setFileDialogActive(false)
      }}
      onFileDialogCancel={() => setFileDialogActive(false)}
      onFileDialogOpen={() => setFileDialogActive(true)}
    >
      {({ isDragActive, open }) => (
        <Context.Provider
          value={{
            isDragActive,
            drop: open,
            onDrop,
            setOnDrop,
            isFileDialogActive,
          }}
        >
          {children}
        </Context.Provider>
      )}
    </DropScripts>
  )
}

export const useDrop = (): DropContext => useContext(Context)

export const useSetDrop = (on: OnDrop | null): void => {
  const { setOnDrop } = useDrop()

  useEffect(() => {
    setOnDrop(() => on)

    return () => setOnDrop(null)
  }, [on, setOnDrop])
}

export default DropProvider
