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

export type ObjectUrlCreator = (blob: Blob) => Url

export const useObjectUrlCreator = (): ObjectUrlCreator => {
  const objectUrls = useRef<Url[]>([])
  useUnmount(() => {
    for (const objectUrl of objectUrls.current) {
      URL.revokeObjectURL(objectUrl)
    }
    objectUrls.current = []
  })
  return useCallback((blob: Blob) => {
    const objectUrl = Url(URL.createObjectURL(blob))
    objectUrls.current.push(objectUrl)
    return objectUrl
  }, [])
}
