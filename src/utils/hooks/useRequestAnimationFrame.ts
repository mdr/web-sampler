import { useCallback, useEffect, useRef } from 'react'

import { Option } from '../types/Option.ts'

export const useRequestAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<Option<number>>(undefined)

  const animate = useCallback(() => {
    callback()
    requestRef.current = requestAnimationFrame(animate)
  }, [callback])

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current !== undefined) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate])
}
