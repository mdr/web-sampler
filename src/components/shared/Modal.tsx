import { ReactNode } from 'react'
import * as ReactAriaComponents from 'react-aria-components'

export interface ModalProps {
  children: ReactNode
  isOpen?: boolean
}

export const Modal = ({ children, isOpen }: ModalProps) => (
  <ReactAriaComponents.ModalOverlay
    isOpen={isOpen}
    className={({ isEntering, isExiting }) =>
      `fixed inset-0 z-10 flex min-h-full items-center justify-center overflow-y-auto bg-black/25 p-4 text-center backdrop-blur-sm ${isEntering ? 'animate-in fade-in duration-300 ease-out' : ''} ${isExiting ? 'animate-out fade-out duration-200 ease-in' : ''} `
    }
  >
    <ReactAriaComponents.Modal
      className={({ isEntering, isExiting }) =>
        `w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl ${isEntering ? 'animate-in zoom-in-95 duration-300 ease-out' : ''} ${isExiting ? 'animate-out zoom-out-95 duration-200 ease-in' : ''} `
      }
    >
      {children}
    </ReactAriaComponents.Modal>
  </ReactAriaComponents.ModalOverlay>
)
