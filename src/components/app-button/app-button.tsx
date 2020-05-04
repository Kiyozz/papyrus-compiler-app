import Button, { ButtonProps } from '@material-ui/core/Button'
import cx from 'classnames'
import React from 'react'

interface OwnProps {
  className?: string
}

type Props = OwnProps & ButtonProps

const AppButton: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <Button className={cx(className)} {...props}>
      {children}
    </Button>
  )
}

export default AppButton
