/*
 * 2022-2026 Kiyozz.
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
