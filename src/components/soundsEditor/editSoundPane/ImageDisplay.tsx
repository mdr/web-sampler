import { useEffect, useState } from 'react'

import { useImage } from '../../../sounds/library/imageHooks.ts'
import { ImageId } from '../../../types/Image.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Url } from '../../../utils/types/brandedTypes.ts'
import { SOUND_TILE_SIZE } from '../../soundboardsEditor/editSoundboardPane/soundTileConstants.ts'

export interface ImageDisplayProps {
  imageId: ImageId
}

export const ImageDisplay = ({ imageId }: ImageDisplayProps) => {
  const image = useImage(imageId)
  const [imageUrl, setImageUrl] = useState<Option<Url>>(undefined)
  const [croppedImageUrl, setCroppedImageUrl] = useState<Option<Url>>(undefined)
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

  useEffect(() => {
    if (crop && imageUrl) {
      const image = new Image()
      image.src = imageUrl

      image.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = SOUND_TILE_SIZE
        canvas.height = SOUND_TILE_SIZE

        const cropX = (crop.x / 100) * image.width
        const cropY = (crop.y / 100) * image.height
        const cropWidth = (crop.width / 100) * image.width
        const cropHeight = (crop.height / 100) * image.height

        ctx.drawImage(image, cropX, cropY, cropWidth, cropHeight, 0, 0, SOUND_TILE_SIZE, SOUND_TILE_SIZE)

        setCroppedImageUrl(Url(canvas.toDataURL()))
      }
    }
  }, [crop, imageUrl])

  return (
    <img
      src={croppedImageUrl}
      alt={image.name}
      style={{ width: `${SOUND_TILE_SIZE}px`, height: `${SOUND_TILE_SIZE}px` }}
    />
  )
}
