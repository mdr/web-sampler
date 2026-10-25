import { useEffect, useState } from 'react'

import { Option } from '../types/Option.ts'
import { Url } from '../types/brandedTypes.ts'

/**
 * Create an object URL for the given blob, revoking it when the blob changes or the component unmounts.
 */
export const useObjectUrl = (blob: Option<Blob>): Option<Url> => {
  const [url, setUrl] = useState<Option<Url>>(undefined)

  useEffect(() => {
    const objectUrl = blob === undefined ? undefined : Url(URL.createObjectURL(blob))
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is an external resource tied to the blob's lifetime
    setUrl(objectUrl)
    return () => {
      if (objectUrl !== undefined) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [blob])

  return url
}
