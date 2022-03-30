/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import cx from 'classnames'
import React from 'react'
import type { HTMLProps } from 'react'

type Props = HTMLProps<HTMLDivElement> & { darker?: boolean }

function Paper({ className, darker = false, ...props }: Props) {
  return (
    <div
      className={cx('paper', darker && 'paper-darker', className)}
      {...props}
    />
  )
}

export default Paper
