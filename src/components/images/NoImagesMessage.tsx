import { NewImageButton } from './NewImageButton.tsx'

export const NoImagesMessage = () => (
  <div className="flex flex-col items-center justify-center">
    <p className="mt-4 text-lg">Click "New Image" to get started!</p>
    <div className="mt-4 flex-grow-0">
      <NewImageButton />
    </div>
  </div>
)
