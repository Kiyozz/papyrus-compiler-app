/*
 * Copyright (c) 2020 Kiyozz.
 *
 * All rights reserved.
 */

import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ActionFunctionAny } from 'redux-actions'
import { RootStore } from './stores/root.store'

export function useStoreSelector<R>(selector: (state: RootStore) => R) {
  return useSelector<RootStore, R>(selector)
}

export function useAction<R extends ActionFunctionAny<unknown>>(
  action: R
): (...params: Parameters<R>) => void {
  const dispatch = useDispatch()

  return useMemo(() => {
    return bindActionCreators(action, dispatch)
  }, [action, dispatch])
}
