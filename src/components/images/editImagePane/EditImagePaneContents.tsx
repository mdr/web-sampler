import { ReactEventHandler, useEffect, useState } from 'react'
import { Crop, ReactCrop, centerCrop, makeAspectCrop } from 'react-image-crop'

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
  const [crop, setCrop] = useState<Crop>()
  const soundActions = useSoundActions()
  const image = useImage(imageId)
  const setImageName = (name: string) => soundActions.setImageName(imageId, name)
  const [imageUrl, setImageUrl] = useState<Option<Url>>(undefined)
  const imageData = image.data
  const onImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: 'px',
          height: 50,
          width: 50,
        },
        1,
        width,
        height,
      ),
      width,
      height,
    )
    setCrop(crop)
  }

  useEffect(() => {
    if (imageData !== undefined) {
      const blob = new Blob([imageData.bytes], { type: imageData.mediaType })
      const url = Url(URL.createObjectURL(blob))
      setImageUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setImageUrl(undefined)
    }
  }, [imageData])
  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <ImageNameTextField name={image.name} setName={setImageName} />
      {image.data === undefined && <ImageUploadZone imageId={imageId} />}
      {imageUrl && (
        <ReactCrop
          className="w-full h-full object-contain rounded-lg"
          crop={crop}
          onChange={setCrop}
          aspect={1}
          minWidth={32}
          minHeight={32}
        >
          <img
            src={imageUrl}
            alt={getImageDisplayName(image)}
            className="max-w-full max-h-96 rounded-lg"
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
    </div>
  )
}
