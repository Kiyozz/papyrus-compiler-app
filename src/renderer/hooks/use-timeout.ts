import { useEffect, useRef } from 'react'

type StartCallback = () => void

type EndCallback = () => void

interface Options {
  time?: number
  end?: EndCallback
}

export default function useTimeout(
  start: StartCallback,
  options: Options = { time: 3000 }
) {
  const timer = useRef<any>(null)

  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(() => start(), options.time || 3000)

    if (options.end) {
      return () => {
        clearTimeout(timer.current)

        options.end!()
      }
    }

    return () => {
      clearTimeout(timer.current)
    }
  }, [start, options])
}
