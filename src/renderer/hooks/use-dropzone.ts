/*
 * 2026 Kiyozz.
 */

import { useEffect, useRef, useSyncExternalStore } from 'react'

type DropState = {
  files: File[]
  isDragging: boolean
}

type Listener = () => void
type DropHandler = (files: File[], event: DragEvent) => void

function createDropzoneStore() {
  let state: DropState = {
    files: [],
    isDragging: false,
  }

  const listeners = new Set<Listener>()
  const dropHandlers = new Set<DropHandler>()

  let isBound = false

  const emit = () => {
    for (const l of listeners) l()
  }

  const setState = (partial: Partial<DropState>) => {
    state = { ...state, ...partial }
    emit()
  }

  const bind = () => {
    if (isBound) return
    isBound = true

    document.addEventListener('dragover', onDragOver)
    document.addEventListener('dragleave', onDragLeave)
    document.addEventListener('drop', onDrop)
  }

  const unbind = () => {
    if (!isBound) return
    isBound = false

    document.removeEventListener('dragover', onDragOver)
    document.removeEventListener('dragleave', onDragLeave)
    document.removeEventListener('drop', onDrop)
  }

  const onDragOver = (e: DragEvent) => {
    e.preventDefault()
    if (!state.isDragging) {
      setState({ isDragging: true })
    }
  }

  const onDragLeave = (e: DragEvent) => {
    if (e.relatedTarget == null) {
      setState({ isDragging: false })
    }
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault()

    const files = Array.from(e.dataTransfer?.files ?? [])

    setState({
      files,
      isDragging: false,
    })

    // 👇 broadcast à tous les hooks
    for (const handler of dropHandlers) {
      handler(files, e)
    }
  }

  return {
    getState: () => state,

    subscribe(listener: Listener) {
      listeners.add(listener)

      bind()

      return () => {
        listeners.delete(listener)

        if (listeners.size === 0) {
          unbind()
        }
      }
    },

    registerDropHandler(handler: DropHandler) {
      dropHandlers.add(handler)

      return () => {
        dropHandlers.delete(handler)
      }
    },
  }
}

const store = createDropzoneStore()

export function useDropzone(options?: {
  onDrop?: (files: File[], event: DragEvent) => void
}) {
  const onDropRef = useRef(options?.onDrop)
  onDropRef.current = options?.onDrop

  const state = useSyncExternalStore(
    store.subscribe,
    store.getState,
    store.getState,
  )

  useEffect(() => {
    if (!onDropRef.current) return

    return store.registerDropHandler((files, event) => {
      onDropRef.current?.(files, event)
    })
  }, [])

  return state
}
