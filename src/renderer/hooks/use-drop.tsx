/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

/* eslint-disable react-hooks/exhaustive-deps */

import React, { createContext, useContext, useEffect, useState } from 'react'

import DropFilesOverlay from '../components/drop/drop-files-overlay'
import DropScripts, { OnDrop } from '../components/drop/drop-scripts'

type _DropContext = {
  onDrop: OnDrop | null
  setOnDrop: (on: (() => OnDrop) | null) => void
  drop: () => void
  isDragActive: boolean
}

const _Context = createContext({} as _DropContext)

const DropProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [onDrop, setOnDrop] = useState<OnDrop | null>(null)

  return (
    <DropScripts onDrop={onDrop}>
      {({ isDragActive, open }) => (
        <_Context.Provider
          value={{
            isDragActive,
            drop: open,
            onDrop,
            setOnDrop,
          }}
        >
          <DropFilesOverlay open={isDragActive && onDrop !== null} />
          {children}
        </_Context.Provider>
      )}
    </DropScripts>
  )
}

export const useDrop = (): _DropContext => useContext(_Context)

export const useSetDrop = (on: OnDrop | null): void => {
  const { setOnDrop } = useDrop()

  useEffect(() => {
    setOnDrop(() => on)

    return () => setOnDrop(null)
  }, [on, setOnDrop])
}

export default DropProvider
