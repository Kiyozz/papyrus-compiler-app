import IconButton, { IconButtonProps } from '@material-ui/core/IconButton'
import cx from 'classnames'
import React from 'react'
import './app-button.scss'

type Props = IconButtonProps

const AppIconButton: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <IconButton className={cx('app-icon-button', className)} {...props}>
      {children}
    </IconButton>
  )
}

export default React.memo(AppIconButton)
