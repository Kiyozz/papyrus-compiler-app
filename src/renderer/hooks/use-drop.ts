/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { OnDropFunction } from '../components/drop-scripts'
import { usePageContext } from '../components/page-context'

interface UseDropOptions {
  button: JSX.Element | null
  onDrop: OnDropFunction | null
}

export const useDrop = (
  options: UseDropOptions
): JSX.Element | undefined | null => {
  const { addScriptsButton, setAddScriptsButton, setOnDrop } = usePageContext()

  useEffect(() => {
    setAddScriptsButton(options.button)

    return () => setAddScriptsButton(null)
  }, [])

  useEffect(() => {
    setOnDrop(() => options.onDrop)

    return () => setOnDrop(null)
  }, [options.onDrop])

  return addScriptsButton
}
