import { Image, ImageCrop, ImageId } from '../../types/Image.ts'
import { ImageBytes, MediaType } from '../../utils/types/brandedTypes.ts'

export interface ImageActions {
  newImage(): Image

  setImageName(id: ImageId, name: string): void

  setImageData(id: ImageId, data: ImageBytes, mediaType: MediaType): void

  setImageCrop(id: ImageId, crop: ImageCrop): void
}
