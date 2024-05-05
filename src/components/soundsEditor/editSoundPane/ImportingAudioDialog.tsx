import { Dialog } from 'react-aria-components'
import { PacmanLoader } from 'react-spinners'

export const ImportingAudioDialog = () => (
  <Dialog className="relative outline-none" aria-label="Importing audio">
    <div className="my-4 flex items-center justify-center">
      <PacmanLoader color="#36d7b7" />
    </div>
    <p className="mt-3 text-slate-500">Importing audio from file. This may take a few seconds.</p>
  </Dialog>
)
