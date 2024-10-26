import { NewSoundboardButton } from './NewSoundboardButton.tsx'

export const NoSoundboardsMessage = () => (
  <div className="flex flex-col items-center justify-center">
    <p className="mt-4 text-lg">Click "New Soundboard" to get started!</p>
    <div className="mt-4 flex-grow-0">
      <NewSoundboardButton />
    </div>
  </div>
)
