/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { Link, LinkProps } from '@reach/router'
import cx from 'classnames'
import React from 'react'

type LinkPropsUnknown = React.PropsWithoutRef<LinkProps<unknown>> &
  React.RefAttributes<HTMLAnchorElement>

interface ActiveLinkProps extends LinkPropsUnknown {
  to: string
  className?: string
  activeClassName?: string
}

export function ActiveLink({
  children,
  className,
  activeClassName,
  ...props
}: ActiveLinkProps): JSX.Element {
  return (
    <Link
      {...props}
      getProps={({ isCurrent }) => ({
        className: cx({ [activeClassName ?? '']: isCurrent }, className)
      })}
    >
      {children}
    </Link>
  )
}
