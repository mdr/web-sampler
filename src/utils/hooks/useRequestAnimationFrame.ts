import { useCallback, useEffect, useRef } from 'react'

export const useRequestAnimationFrame = (callback: () => void) => {
  const requestRef = useRef<number>()

  const animate = useCallback(() => {
    callback()
    requestRef.current = requestAnimationFrame(animate)
  }, [callback])

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [animate])
}
