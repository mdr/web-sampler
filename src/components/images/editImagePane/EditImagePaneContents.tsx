import { ReactEventHandler, useEffect, useState } from 'react'
import { PercentCrop, ReactCrop, centerCrop, makeAspectCrop } from 'react-image-crop'

import { useImage } from '../../../sounds/library/imageHooks.ts'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { ImageId, getImageDisplayName } from '../../../types/Image.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Url } from '../../../utils/types/brandedTypes.ts'
import { EditImagePaneTestIds } from './EditImagePaneTestIds.ts'
import { ImageNameTextField } from './ImageNameTextField.tsx'
import { ImageUploadZone } from './ImageUploadZone.tsx'
import { imageCropToPercentCrop, percentCropToImageCrop } from './cropConversions.ts'

export interface EditImagePaneContentsProps {
  imageId: ImageId
}

export const EditImagePaneContents = ({ imageId }: EditImagePaneContentsProps) => {
  const image = useImage(imageId)
  const imageData = image.data
  const imageCrop = imageData?.crop
  const initialCrop = imageCrop === undefined ? undefined : imageCropToPercentCrop(imageCrop)
  const [crop, setCrop] = useState<Option<PercentCrop>>(initialCrop)
  const soundActions = useSoundActions()
  const setImageName = (name: string) => soundActions.setImageName(imageId, name)
  const [imageUrl, setImageUrl] = useState<Option<Url>>(undefined)
  const onImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget
    const crop = centerCrop(makeAspectCrop({ unit: '%', height: 100 }, 1, width, height), width, height)
    if (initialCrop === undefined) {
      setCrop(crop)
    }
  }

  const handleCropChange = (percentageCrop: PercentCrop) => {
    soundActions.setImageCrop(imageId, percentCropToImageCrop(percentageCrop))
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
          crop={crop}
          onChange={(_, percentageCrop) => setCrop(percentageCrop)}
          onComplete={(_, percentageCrop) => handleCropChange(percentageCrop)}
          aspect={1}
          minWidth={32}
          minHeight={32}
        >
          <img
            data-testid={EditImagePaneTestIds.image}
            src={imageUrl}
            alt={getImageDisplayName(image)}
            onLoad={onImageLoad}
          />
        </ReactCrop>
      )}
    </div>
  )
}
