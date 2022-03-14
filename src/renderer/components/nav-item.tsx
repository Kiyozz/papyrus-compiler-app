/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'

const NavItem = ({ className, ...props }: React.HTMLProps<HTMLLIElement>) => (
  <li
    tabIndex={-1}
    className={cx(
      'flex w-full whitespace-nowrap px-4 py-2 transition-colors',
      className,
    )}
    {...props}
  />
)

export default NavItem
