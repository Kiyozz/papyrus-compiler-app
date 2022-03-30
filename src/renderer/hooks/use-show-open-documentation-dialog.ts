/*
 * Copyright (c) 2022 Kiyozz~WK~WushuLate.
 *
 * All rights reserved.
 */

import useLocalStorage from 'react-use-localstorage'
import { LocalStorage } from '../enums/local-storage.enum'

export const useShowOpenDocumentationDialog = () => {
  const [isShowOpenDocumentationDialog, setShowOpenDocumentationDialog] =
    useLocalStorage(LocalStorage.showOpenDocumentationDialog, 'true')

  const toggle = () => {
    setShowOpenDocumentationDialog(
      isShowOpenDocumentationDialog === 'true' ? 'false' : 'true',
    )
  }

  return [isShowOpenDocumentationDialog === 'true', toggle] as const
}
