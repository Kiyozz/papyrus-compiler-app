/*
 * Copyright (c) 2021 Kiyozz.
 *
 * All rights reserved.
 */

import { RefObject, useCallback, useEffect } from 'react'

interface UseStopScrollOptions {
  notIn?: RefObject<HTMLElement>
}

const deepChilds = (element?: HTMLElement | ChildNode | null) => {
  if (typeof element === 'undefined' || element === null) {
    return []
  }

  let childs = Array.from(element.childNodes)

  if (childs.length > 0) {
    let childNotesDeep: ChildNode[] = []

    for (const child of childs) {
      childNotesDeep = [...childNotesDeep, ...deepChilds(child)]
    }

    childs = [...childs, ...childNotesDeep]
  }

  return childs
}

export default function useStopScroll(options: UseStopScrollOptions = {}) {
  const onScroll = useCallback(
    (e: Event) => {
      if (
        !deepChilds(options.notIn?.current).includes(e.target as HTMLElement)
      ) {
        e.preventDefault()
        e.returnValue = false

        return false
      }
    },
    [options.notIn]
  )

  useEffect(() => {
    window.addEventListener('DOMMouseScroll', onScroll, { passive: false })
    window.addEventListener('wheel', onScroll, { passive: false })

    return () => {
      window.removeEventListener('DOMMouseScroll', onScroll, false)
      window.removeEventListener('wheel', onScroll, false)
    }
  }, [onScroll])
}
