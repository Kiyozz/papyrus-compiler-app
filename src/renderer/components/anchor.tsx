/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React from 'react'
import bridge from '../bridge'

function Anchor({
  children,
  href,
}: React.PropsWithChildren<React.HTMLProps<HTMLAnchorElement>>) {
  const onClick = () => {
    if (href) {
      bridge.shell.openExternal(href)
    }
  }

  return <a onClick={onClick}>{children}</a>
}

export default Anchor
