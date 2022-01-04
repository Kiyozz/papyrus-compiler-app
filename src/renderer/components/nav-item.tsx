/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'

const NavItem = ({ className, ...props }: React.HTMLProps<HTMLLIElement>) => (
  <li
    tabIndex={-1}
    className={cx('w-full px-4 py-2 flex transition-colors', className)}
    {...props}
  />
)

export default NavItem
