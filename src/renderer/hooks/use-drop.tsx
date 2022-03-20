/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

/* eslint-disable react-hooks/exhaustive-deps */

import React, { createContext, useContext, useEffect, useState } from 'react'

import DropFilesOverlay from '../components/drop/drop-files-overlay'
import DropScripts, { OnDrop } from '../components/drop/drop-scripts'

type DropContext = {
  onDrop: OnDrop | null
  setOnDrop: (on: (() => OnDrop) | null) => void
  drop: () => void
  isDragActive: boolean
  isFileDialogActive: boolean
}

const Context = createContext({} as DropContext)

const DropProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [onDrop, setOnDrop] = useState<OnDrop | null>(null)
  const [isFileDialogActive, setFileDialogActive] = useState(false)

  return (
    <DropScripts
      onDrop={files => {
        onDrop?.(files)
        setFileDialogActive(false)
      }}
      onFileDialogOpen={() => setFileDialogActive(true)}
      onFileDialogCancel={() => setFileDialogActive(false)}
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
          <DropFilesOverlay open={isDragActive && onDrop !== null} />
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
