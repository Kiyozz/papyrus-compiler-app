/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import React from 'react'

export function Alert({ children }: React.PropsWithChildren<unknown>) {
  return (
    <div className="text-red-400 mt-3 text-sm flex gap-2 p-2 items-center">
      {children}
    </div>
  )
}
