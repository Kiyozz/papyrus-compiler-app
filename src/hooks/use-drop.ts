/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { OnDropFunction } from '../components/drop-scripts/drop-scripts'
import { usePageContext } from '../components/page/page-context'

interface UseDropOptions {
  button: JSX.Element | null
  onDrop: OnDropFunction | null
}

export const useDrop = (options: UseDropOptions): JSX.Element | undefined | null => {
  const { addScriptsButton, setAddScriptsButton, setOnDrop } = usePageContext()

  React.useEffect(() => {
    setAddScriptsButton(options.button)

    return () => setAddScriptsButton(null)
  }, [])

  React.useEffect(() => {
    setOnDrop(() => options.onDrop)

    return () => setOnDrop(null)
  }, [])

  return addScriptsButton
}
