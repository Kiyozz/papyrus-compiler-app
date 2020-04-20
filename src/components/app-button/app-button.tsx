import Button, { ButtonProps } from '@material-ui/core/Button'
import cx from 'classnames'
import React from 'react'
import './app-button.scss'

interface OwnProps {
  className?: string
}

type Props = OwnProps & ButtonProps

const AppButton: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <Button className={cx('app-button', className)} {...props}>
      {children}
    </Button>
  )
}

export default AppButton
