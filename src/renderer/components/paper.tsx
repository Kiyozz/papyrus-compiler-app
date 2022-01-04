import cx from 'classnames'
import React from 'react'
import { HTMLProps } from 'react'

type Props = HTMLProps<HTMLDivElement> & { darker?: boolean }

const Paper = ({ className, darker = false, ...props }: Props) => {
  return (
    <div
      className={cx('paper', darker && 'paper-darker', className)}
      {...props}
    />
  )
}

export default Paper
