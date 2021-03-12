/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'

interface Props {
  open: boolean
}

export function DropFilesOverlay({ open }: Props): JSX.Element | null {
  if (!open) {
    return null
  }

  return (
    <div className="fixed dark:bg-black-800 bg-opacity-60 z-20 top-0 right-0 bottom-0 left-0 w-full h-full flex justify-center items-center">
      <div className="dark:bg-gray-700 rounded shadow w-full max-w-screen-sm h-1/2 p-4 py-8">
        <div className="flex items-center justify-center text-white text-4xl font-nova font-bold h-full w-full">
          Drop files
        </div>
      </div>
    </div>
  )
}
