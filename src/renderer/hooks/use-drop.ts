/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from 'react'

import { OnDropFunction } from '../components/drop/drop-scripts'
import { useApp } from './use-app'

interface UseDropOptions {
  button: JSX.Element | null
  onDrop: OnDropFunction | null
}

export const useDrop = (
  options: UseDropOptions
): JSX.Element | undefined | null => {
  const { addScriptsButton, setAddScriptsButton, setOnDrop } = useApp()

  useEffect(() => {
    setAddScriptsButton(options.button)

    return () => setAddScriptsButton(null)
  }, [])

  useEffect(() => {
    setOnDrop(() => options.onDrop)

    return () => setOnDrop(null)
  }, [])

  return addScriptsButton
}
