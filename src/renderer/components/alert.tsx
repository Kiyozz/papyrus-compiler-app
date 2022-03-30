/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React from 'react'

function Alert({ children }: React.PropsWithChildren<unknown>) {
  return <div className="mt-3 flex items-center gap-2 p-2 text-sm text-red-700 dark:text-red-400">
    {children}
  </div>
}

export default Alert
