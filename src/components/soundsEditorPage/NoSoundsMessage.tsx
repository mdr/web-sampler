import { NewSoundButton } from './NewSoundButton.tsx'

import { NoSoundsMessageTestIds } from './EditSoundPaneTestIds.ts'

export const NoSoundsMessage = () => (
  <div className="flex flex-col items-center justify-center">
    <p className="mt-4 text-lg">Click "New Sound" to get started!</p>
    <div className="mt-4 flex-grow-0">
      <NewSoundButton testId={NoSoundsMessageTestIds.newSoundButton} />
    </div>
  </div>
)
