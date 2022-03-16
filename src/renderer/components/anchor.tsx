/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React from 'react'

import { useBridge } from '../hooks/use-bridge'

const Anchor = ({
  children,
  href,
}: React.PropsWithChildren<React.HTMLProps<HTMLAnchorElement>>) => {
  const { shell } = useBridge()

  const onClick = () => {
    if (href) {
      shell.openExternal(href)
    }
  }

  return <a onClick={onClick}>{children}</a>
}

export default Anchor
