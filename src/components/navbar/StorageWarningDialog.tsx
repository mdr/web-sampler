import { mdiAlert, mdiDatabaseLock } from '@mdi/js'
import Icon from '@mdi/react'
import { Dialog, Heading } from 'react-aria-components'

import { useStorageActions } from '../../storage/storageHooks.ts'
import { isChromiumBasedBrowser } from '../../utils/browserUtils.ts'
import { fireAndForget } from '../../utils/utils.ts'
import { Button } from '../shared/Button.tsx'
import { ButtonVariant } from '../shared/ButtonVariant.tsx'
import { StorageWarningDialogTestIds } from './StorageWarningDialogTestIds.ts'

export const StorageWarningDialog = () => {
  const storageActions = useStorageActions()
  return (
    <Dialog data-testid={StorageWarningDialogTestIds.dialog} className="relative outline-hidden">
      {({ close }) => (
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
              onPress={() => fireAndForget(storageActions.attemptToMakeStoragePersistent)}
            />
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant={ButtonVariant.PRIMARY} label="Close" onPress={close} />
          </div>
        </>
      )}
    </Dialog>
  )
}
