import React from 'react'
import useDidMount from 'beautiful-react-hooks/useDidMount'
import { fireAndForget } from '../../utils/utils.ts'
import { toast } from 'react-toastify'

export const MakeStoragePersistent: React.FC = () => {
  useDidMount(() => {
    fireAndForget(async () => {
      const success = await navigator.storage.persist()
      if (!success) {
        toast.warn('Could not make storage persistent - browser may delete data', {
          autoClose: false,
        })
      }
    })
  })
  return undefined
}
