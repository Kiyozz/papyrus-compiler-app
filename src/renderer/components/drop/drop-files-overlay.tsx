/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React from 'react'

type Props = {
  open: boolean
}

const DropFilesOverlay = ({ open }: Props) => {
  if (!open) {
    return null
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-20 flex h-full w-full items-center justify-center bg-black-800 bg-opacity-60">
      <div className="h-1/2 w-full max-w-screen-sm rounded bg-light-600 p-4 py-8 shadow dark:bg-gray-700">
        <div className="flex h-full w-full items-center justify-center font-nova text-4xl font-bold text-black-600 dark:text-white">
          Drop files
        </div>
      </div>
    </div>
  )
}

export default DropFilesOverlay
