import React from 'react'
import useDidMount from 'beautiful-react-hooks/useDidMount'
import { fireAndForget } from '../../utils/utils.ts'

export const MakeStoragePersistent: React.FC = () => {
  useDidMount(() => {
    fireAndForget(async () => {
      const success = await navigator.storage.persist()
      if (!success) {
        console.warn('Could not make storage persistent - browser may delete data')
        // toast.warn('Could not make storage persistent - browser may delete data', {
        //   autoClose: false,
        // })
      }
    })
  })
  return undefined
}
