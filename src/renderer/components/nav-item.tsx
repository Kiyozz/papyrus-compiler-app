/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'

export function NavItem({
  className,
  ...props
}: React.HTMLProps<HTMLLIElement>): JSX.Element {
  return (
    <li
      tabIndex={-1}
      className={cx('w-full px-4 py-2 flex transition-colors', className)}
      {...props}
    />
  )
}
