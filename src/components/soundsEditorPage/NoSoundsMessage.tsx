import { NewSoundButton } from './NewSoundButton.tsx'

import { NoSoundsMessageTestIds } from './EditSoundPaneTestIds.ts'

export const NoSoundsMessage = () => (
  <div className="h- flex items-center justify-center">
    <div className="flex flex-col">
      <p className="py-2  text-lg">No sounds created yet.</p>
      <NewSoundButton testId={NoSoundsMessageTestIds.newSoundButton} />
    </div>
  </div>
)
