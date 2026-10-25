import { useEffect } from 'react'

export const useRequestAnimationFrame = (callback: () => void) => {
  useEffect(() => {
    let requestId: number
    const animate = () => {
      callback()
      requestId = requestAnimationFrame(animate)
    }
    requestId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestId)
  }, [callback])
}
