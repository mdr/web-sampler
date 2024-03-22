import { fireAndForget } from '../../utils/utils.ts'
import { toast } from 'react-toastify'
import { Dialog, Heading } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiAlert, mdiDatabaseLock } from '@mdi/js'
import { Button, ButtonVariant } from '../shared/Button.tsx'
import { useStorageManagerActions } from '../../storage/storageManagerHooks.ts'
import { isChromiumBasedBrowser } from '../../utils/browserUtils.ts'
import { StorageWarningDialogTestIds } from './StorageWarningDialogTestIds.ts'

export const StorageWarningDialog = () => {
  const storageManagerActions = useStorageManagerActions()
  return (
    <Dialog data-testid={StorageWarningDialogTestIds.dialog} className="relative outline-none">
      {({ close }) => {
        const handleAttemptToMakePersistent = () => {
          fireAndForget(async () => {
            const result = await storageManagerActions.attemptToMakeStoragePersistent()
            switch (result) {
              case 'SUCCESSFUL':
                toast.info('Storage is now persistent. Your recordings are safe in local storage.')
                close()
                break
              case 'UNSUCCESSFUL':
                toast.error('Unable to make storage persistent.')
                break
              case 'NOTIFICATION_PERMISSION_DENIED':
                toast.error('Grant notification permission to make storage persistent.')
                break
            }
          })
        }
        return (
          <>
            <Heading slot="title" className="my-0 text-lg font-semibold leading-6 text-slate-700">
              Storage Is Not Persistent
            </Heading>
            <Icon path={mdiAlert} size={1} title="Warning" className="absolute right-0 top-0 h-6 w-6 text-yellow-400" />
            <p className="mt-3 text-slate-500">
              Your browser has not granted permission to make storage persistent. This means that your data in local
              storage can in theory be deleted at any time.
            </p>
            {isChromiumBasedBrowser() && (
              <p className="mt-3 text-slate-500">
                To make storage persistent, you can grant notification permission. This is the most reliable way to make
                storage persistent on Chromium-based browsers. This site will not send you any notifications.
              </p>
            )}
            <div className="mt-6 flex justify-center">
              <Button
                icon={mdiDatabaseLock}
                label="Attempt To Make Storage Persistent"
                testId={StorageWarningDialogTestIds.attemptToMakeStoragePersistentButton}
                onPress={handleAttemptToMakePersistent}
              />
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
