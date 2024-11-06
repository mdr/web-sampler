import { mdiAlertOctagon } from '@mdi/js'
import Icon from '@mdi/react'

export const AlreadyOpenInAnotherTabPage = () => (
  <div className="flex h-screen">
    <div className="m-auto text-center">
      <Icon path={mdiAlertOctagon} size={3} className="m-auto text-red-500" />
      <h1 className="mt-5 text-xl font-semibold">Already Open</h1>
      <p className="mt-2">Sound Sampler is already open in another tab, and can only be used in one tab at a time.</p>
      <p>Close the other tab in order to use the application here.</p>
    </div>
  </div>
)
