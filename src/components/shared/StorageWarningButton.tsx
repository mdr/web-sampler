import { Button as RacButton, Dialog, DialogTrigger, Heading, Modal, ModalOverlay } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiAlert } from '@mdi/js'
import { Button } from './Button.tsx'
import { useStorageManagerActions } from '../../storage/storageManagerHooks.ts'

export const StorageWarningButton = () => {
  // const { isStoragePersistent } = useStorageManagerState()
  const storageManagerActions = useStorageManagerActions()
  return (
    <DialogTrigger>
      <RacButton>
        <Icon path={mdiAlert} size={1} title="Warning" className="hover:text-gray-300" />
      </RacButton>
      <ModalOverlay
        className={({ isEntering, isExiting }) => `
            fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur
            ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''}
            ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''}
          `}
      >
        <Modal
          className={({ isEntering, isExiting }) => `
              w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl
              ${isEntering ? 'animate-in zoom-in-95 duration-300 ease-out' : ''}
              ${isExiting ? 'animate-out zoom-out-95 duration-200 ease-in' : ''}
            `}
        >
          <Dialog className="relative outline-none">
            {({ close }) => (
              <>
                <Heading slot="title" className="text-xxl my-0 font-semibold leading-6 text-slate-700">
                  Unable to Make Storage Persistent
                </Heading>
                <Icon
                  path={mdiAlert}
                  size={1}
                  title="Warning"
                  className="absolute right-0 top-0 h-6 w-6 text-yellow-400"
                />
                <p className="mt-3 text-slate-500">
                  Your browser has not granted permission to make storage persistent. This means that your recordings
                  may not be 100% safe in local storage.
                </p>
                <div className="mt-6 flex justify-center">
                  <Button
                    label="Attempt to make persistent"
                    onPress={() => storageManagerActions.attemptToMakeStoragePersistent()}
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <Button label="Close" onPress={close} />
                </div>
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </DialogTrigger>
  )
}
