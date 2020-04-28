import { styled } from '@material-ui/core/styles'
import cx from 'classnames'
import React from 'react'
import './app-title.scss'

interface Props {
  className?: string
}

const Title = styled('h1')({
  fontSize: '2.5rem',
  position: 'sticky',
  top: 0,
  zIndex: 50,
  paddingTop: 15,
  marginLeft: -2,
  marginRight: -2
})

const AppTitle: React.FC<Props> = ({ children, className }) => {
  return (
    <Title className={cx(['app-title', className])}>{children}</Title>
  )
}

export default AppTitle
