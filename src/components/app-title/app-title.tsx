import styled from '@emotion/styled'
import cx from 'classnames'
import React from 'react'
import './app-title.scss'

interface Props {
  className?: string
}

const Title = styled.h1`
  font-size: 2.5rem;
  position: sticky;
  top: 0;
  z-index: 50;
  padding-top: 15;
  margin-left: -2;
  margin-right: -2;
`

const AppTitle: React.FC<Props> = ({ children, className }) => {
  return (
    <Title className={cx(['app-title', className])}>{children}</Title>
  )
}

export default AppTitle
