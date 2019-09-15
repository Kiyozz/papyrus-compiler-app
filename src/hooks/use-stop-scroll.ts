import { useCallback, useEffect } from 'react'

export default function useStopScroll() {
  const onScroll = useCallback((e: Event) => {
    e.preventDefault()
    e.returnValue = false

    return false
  }, [])

  useEffect(() => {
    window.addEventListener('DOMMouseScroll', onScroll, { passive: false })
    window.addEventListener('wheel', onScroll, { passive: false })

    return () => {
      window.removeEventListener('DOMMouseScroll', onScroll, false)
      window.removeEventListener('wheel', onScroll, false)
    }
  }, [onScroll])
}
