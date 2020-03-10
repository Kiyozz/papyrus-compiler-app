import cx from 'classnames'
import React from 'react'
import './app-button.scss'

interface OwnProps {
  className?: string
}

type Props = OwnProps & React.ButtonHTMLAttributes<HTMLButtonElement>

const AppButton: React.FC<Props> = ({ className, children, ...props }) => {
  return (
    <button className={cx('app-button', className)} {...props}>
      {children}
    </button>
  )
}

export default AppButton
