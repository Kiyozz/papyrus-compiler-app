/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import React from 'react'
import { bridge } from '../bridge'
import type { HTMLProps, PropsWithChildren } from 'react'

function Anchor({
  children,
  href,
}: PropsWithChildren<HTMLProps<HTMLAnchorElement>>) {
  const onClick = () => {
    if (href) {
      void bridge.shell.openExternal(href)
    }
  }

  return (
    <button onClick={onClick} type="button">
      {children}
    </button>
  )
}

export default Anchor
