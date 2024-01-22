import { useCallback, useEffect, useRef } from 'react'
import { Url } from './types/Url.ts'
import useUnmount from 'beautiful-react-hooks/useUnmount'

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

  return requestRef
}

export const useObjectUrlCreator = (): ((blob: Blob) => Url) => {
  const objectUrls = useRef<Url[]>([])
  useUnmount(() => {
    for (const objectUrl of objectUrls.current) {
      URL.revokeObjectURL(objectUrl)
    }
  })
  return useCallback((blob: Blob) => {
    const objectUrl = Url(URL.createObjectURL(blob))
    objectUrls.current.push(objectUrl)
    return objectUrl
  }, [])
}
