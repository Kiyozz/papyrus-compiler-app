import cx from 'classnames'
import React from 'react'
import classes from './title.module.scss'

interface Props {
  className?: string
}

const Title: React.FC<Props> = ({ children, className }) => {
  return (
    <h1 className={cx([classes.title, className])}>{children}</h1>
  )
}

export default Title
