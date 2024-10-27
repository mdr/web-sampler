import { useEffect, useState } from 'react'

import { useImage } from '../../../sounds/library/imageHooks.ts'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { ImageId, getImageDisplayName } from '../../../types/Image.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Url } from '../../../utils/types/brandedTypes.ts'
import { ImageNameTextField } from './ImageNameTextField.tsx'
import { ImageUploadZone } from './ImageUploadZone.tsx'

export interface EditImagePaneContentsProps {
  imageId: ImageId
}

export const EditImagePaneContents = ({ imageId }: EditImagePaneContentsProps) => {
  const soundActions = useSoundActions()
  const image = useImage(imageId)
  const setImageName = (name: string) => soundActions.setImageName(imageId, name)
  const [imageUrl, setImageUrl] = useState<Option<Url>>(undefined)
  useEffect(() => {
    if (image.data !== undefined) {
      const blob = new Blob([image.data.bytes], { type: 'image/jpeg' })
      const url = Url(URL.createObjectURL(blob))
      setImageUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setImageUrl(undefined)
    }
  }, [image.data])

  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <ImageNameTextField name={image.name} setName={setImageName} />
      {image.data === undefined && <ImageUploadZone imageId={imageId} />}
      {imageUrl && (
        <div className="w-full max-h-96 flex justify-center items-center overflow-hidden rounded-lg">
          <img src={imageUrl} alt={getImageDisplayName(image)} className="max-w-full max-h-96 rounded-lg" />
        </div>
      )}
    </div>
  )
}
