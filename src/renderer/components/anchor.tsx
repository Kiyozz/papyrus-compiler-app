/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import type { ComponentProps } from 'react'
import { bridge } from '../bridge'

function Anchor({ children, href }: ComponentProps<'a'>) {
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
