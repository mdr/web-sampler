import { NewSoundButton } from './NewSoundButton.tsx'

import { NoSoundsMessageTestIds } from './EditSoundPaneTestIds.ts'

export const NoSoundsMessage = () => (
  <div className="flex items-center justify-center h-">
    <div className="flex flex-col">
      <p className="text-lg  py-2">No sounds created yet.</p>
      <NewSoundButton testId={NoSoundsMessageTestIds.newSoundButton} />
    </div>
  </div>
)
