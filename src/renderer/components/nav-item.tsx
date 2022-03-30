/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'

function NavItem({ className, ...props }: React.HTMLProps<HTMLLIElement>) {
  return <li
    className={cx(
      'flex w-full whitespace-nowrap px-4 py-2 transition-colors',
      className,
    )}
    tabIndex={-1}
    {...props}
  />
}

export default NavItem
