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
      'w-full px-4 py-2 flex transition-colors whitespace-nowrap',
      className,
    )}
    {...props}
  />
)

export default NavItem
