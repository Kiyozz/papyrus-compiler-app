import { useCallback, useEffect } from 'react'

export default function useOnEscape(action: () => void) {
  const onKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Escape') {
      return
    }

    action()
  }, [action])

  useEffect(() => {
    document.body.addEventListener('keyup', onKeyUp)

    return () => {
      document.body.removeEventListener('keyup', onKeyUp)
    }
  }, [onKeyUp])
}
