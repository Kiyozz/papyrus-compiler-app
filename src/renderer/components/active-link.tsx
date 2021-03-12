/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Link, LinkProps } from '@reach/router'
import cx from 'classnames'
import React from 'react'

import { useFocus } from '../hooks/use-focus'

type LinkPropsUnknown = React.PropsWithoutRef<LinkProps<unknown>> &
  React.RefAttributes<HTMLAnchorElement>

interface ActiveLinkProps extends LinkPropsUnknown {
  to: string
  className?: string
  activeClassName?: string
  activeUnfocusClassName?: string
}

export function ActiveLink({
  children,
  className,
  activeClassName,
  activeUnfocusClassName,
  ...props
}: ActiveLinkProps): JSX.Element {
  const isFocus = useFocus()

  return (
    <Link
      {...props}
      getProps={({ isCurrent }) => ({
        className: cx(
          {
            [activeClassName ?? '']: isCurrent,
            [activeUnfocusClassName ?? '']: !isFocus && isCurrent
          },
          className
        )
      })}
    >
      {children}
    </Link>
  )
}
