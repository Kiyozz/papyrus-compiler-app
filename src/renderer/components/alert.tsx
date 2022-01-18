/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React from 'react'

const Alert = ({ children }: React.PropsWithChildren<unknown>) => (
  <div className="text-red-700 dark:text-red-400 mt-3 text-sm flex gap-2 p-2 items-center">
    {children}
  </div>
)

export default Alert
