/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'

interface Props {
  open: boolean
}

export function DropFilesOverlay({ open }: Props) {
  if (!open) {
    return null
  }

  return (
    <div className="fixed bg-black bg-opacity-60 z-20 top-0 right-0 bottom-0 left-0 w-full h-full flex justify-center items-center">
      <div className="bg-gray-700 rounded shadow w-full max-w-screen-sm h-1/2 p-4 py-8">
        <div className="flex items-center justify-center text-white text-4xl font-nova font-bold h-full w-full">
          Drop files
        </div>
      </div>
    </div>
  )
}
