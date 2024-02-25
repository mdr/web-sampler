import { fireAndForget } from '../../../utils/utils.ts'
import { toast } from 'react-toastify'
import { Dialog, Heading } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiAlert } from '@mdi/js'
import { Button, ButtonVariant } from '../../shared/Button.tsx'
import { useStorageManagerActions } from '../../../storage/storageManagerHooks.ts'

export const StorageWarningDialog = () => {
  const storageManagerActions = useStorageManagerActions()
  return (
    <Dialog className="relative outline-none">
      {({ close }) => {
        const handleAttemptToMakePersistent = () => {
          fireAndForget(async () => {
            const notificationPermission = await Notification.requestPermission()
            if (notificationPermission !== 'granted') {
              toast.error('You need to grant notification permission to make storage persistent.')
              return
            }
            const isStoragePersistent = await storageManagerActions.attemptToMakeStoragePersistent()
            if (isStoragePersistent) {
              toast.info('Storage is now persistent. Your recordings are safe in local storage.')
              close()
            } else {
              toast.error('Unable to make storage persistent.')
            }
          })
        }
        return (
          <>
            <Heading slot="title" className="text-xxl my-0 font-semibold leading-6 text-slate-700">
              Unable to Make Storage Persistent
            </Heading>
            <Icon path={mdiAlert} size={1} title="Warning" className="absolute right-0 top-0 h-6 w-6 text-yellow-400" />
            <p className="mt-3 text-slate-500">
              Your browser has not granted permission to make storage persistent. This means that your recordings may
              not be 100% safe in local storage.
            </p>
            <div className="mt-6 flex justify-center">
              <Button label="Attempt To Make Persistent" onPress={handleAttemptToMakePersistent} />
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant={ButtonVariant.PRIMARY} label="Close" onPress={close} />
            </div>
          </>
        )
      }}
    </Dialog>
  )
}
