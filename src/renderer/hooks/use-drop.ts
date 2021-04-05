/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */
/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from 'react'

import { OnDropFunction } from '../components/drop/drop-scripts'
import { useApp } from './use-app'

type UseDropOptions = OnDropFunction | null

export const useDrop = (onDrop: UseDropOptions): void => {
  const { setOnDrop } = useApp()

  useEffect(() => {
    setOnDrop(() => onDrop)

    return () => setOnDrop(null)
  }, [])
}
