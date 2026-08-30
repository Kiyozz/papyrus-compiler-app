/*
 * 2022-2026 Kiyozz.
 */

import { bridge } from '../bridge'
import type { ComponentProps } from 'react'

function Anchor({ children, href }: ComponentProps<'a'>) {
  const onClick = () => {
    if (href) {
      void bridge.shell.openExternal(href)
    }
  }

  return (
    <button
      className="cursor-pointer text-primary underline underline-offset-4"
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

export default Anchor
