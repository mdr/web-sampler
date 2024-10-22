import { useImage } from '../../../sounds/library/imageHooks.ts'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { ImageId } from '../../../types/Image.ts'
import { ImageNameTextField } from './ImageNameTextField.tsx'

export interface EditImagePaneContentsProps {
  imageId: ImageId
}

export const EditImagePaneContents = ({ imageId }: EditImagePaneContentsProps) => {
  const soundActions = useSoundActions()
  const image = useImage(imageId)
  const setImageName = (name: string) => soundActions.setImageName(imageId, name)
  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <ImageNameTextField name={image.name} setName={setImageName} />
    </div>
  )
}
