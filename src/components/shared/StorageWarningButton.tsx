import { Button as RacButton, DialogTrigger, Modal, ModalOverlay } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiAlert } from '@mdi/js'
import { StorageWarningDialog } from './StorageWarningDialog.tsx'

export const StorageWarningButton = () => (
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
        <StorageWarningDialog />
      </Modal>
    </ModalOverlay>
  </DialogTrigger>
)
