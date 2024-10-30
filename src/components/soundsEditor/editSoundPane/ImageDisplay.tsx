import { FC, useEffect, useState } from 'react'

import { useImage } from '../../../sounds/library/imageHooks.ts'
import { ImageId } from '../../../types/Image.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Url } from '../../../utils/types/brandedTypes.ts'

export interface ImageDisplayProps {
  imageId: ImageId
}

export const ImageDisplay: FC<ImageDisplayProps> = ({ imageId }) => {
  const image = useImage(imageId)
  const [imageUrl, setImageUrl] = useState<Option<Url>>(undefined)

  const { data: imageData } = image

  if (imageData === undefined) {
    return null
  }

  useEffect(() => {
    const blob = new Blob([imageData.bytes], { type: imageData.mediaType })
    const url = Url(URL.createObjectURL(blob))
    setImageUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [imageData])

  const crop = imageData.crop

  if (crop === undefined) {
    return <img src={imageUrl} alt={image.name} />
  }
  return <img src={imageUrl} alt="Cropped Image" style={{}} />
}
