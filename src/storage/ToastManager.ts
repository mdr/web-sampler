import { toast } from 'react-toastify'

export interface ToastManager {
  info: (message: string) => void
  error: (message: string) => void
}

export class ReactToastifyToastManager implements ToastManager {
  info = (message: string) => toast.info(message)

  error = (message: string) => toast.error(message)
}
