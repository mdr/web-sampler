import { NewSoundButton } from '../shared/NewSoundButton.tsx'
import { NoSoundsMessageTestIds } from './HomePage.testIds.ts'

export const NoSoundsMessage = () => (
  <div className="flex items-center justify-center h-">
    <div className="flex flex-col">
      <p className="text-lg  py-2">No sounds created yet.</p>
      <NewSoundButton testId={NoSoundsMessageTestIds.newSoundButton} />
    </div>
  </div>
)
