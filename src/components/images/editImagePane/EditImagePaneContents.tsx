import { ReactEventHandler, useMemo, useState } from 'react'
import { PercentCrop, ReactCrop, centerCrop, makeAspectCrop } from 'react-image-crop'

import { useImage } from '../../../sounds/library/imageHooks.ts'
import { useImageActions } from '../../../sounds/library/soundHooks.ts'
import { ImageId, getImageDisplayName } from '../../../types/Image.ts'
import { useObjectUrl } from '../../../utils/hooks/useObjectUrl.ts'
import { Option } from '../../../utils/types/Option.ts'
import { DeleteImageButton } from './DeleteImageButton.tsx'
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
  const imageActions = useImageActions()
  const setImageName = (name: string) => imageActions.setImageName(imageId, name)
  const onImageLoad: ReactEventHandler<HTMLImageElement> = (e) => {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget
    const crop = centerCrop(makeAspectCrop({ unit: '%', height: 100 }, 1, width, height), width, height)
    if (initialCrop === undefined) {
      setCrop(crop)
    }
  }

  const handleCropChange = (percentageCrop: PercentCrop) => {
    imageActions.setImageCrop(imageId, percentCropToImageCrop(percentageCrop))
  }

  const blob = useMemo(
    () => (imageData === undefined ? undefined : new Blob([imageData.bytes], { type: imageData.mediaType })),
    [imageData],
  )
  const imageUrl = useObjectUrl(blob)
  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <ImageNameTextField name={image.name} setName={setImageName} />
      <div className="flex space-x-2">
        <DeleteImageButton imageId={imageId} />
      </div>
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
