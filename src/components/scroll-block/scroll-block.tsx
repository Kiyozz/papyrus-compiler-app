import React from 'react'
import useStopScroll from '../../hooks/use-stop-scroll'

interface Props {
  children: React.ReactNode
}

const ScrollBlock: React.FC<Props> = ({ children }) => {
  useStopScroll()

  return (
    <>
      {children}
    </>
  )
}

export default React.memo(ScrollBlock)
