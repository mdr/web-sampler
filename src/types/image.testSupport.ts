import { ImageBytes, JPEG_MEDIA_TYPE, Percent } from '../utils/types/brandedTypes.ts'
import { Image, ImageCrop, ImageData, ImageId, newImageId } from './Image.ts'

export const ImageTestConstants = {
  id: ImageId('ImageTestConstants.id'),
  id2: ImageId('ImageTestConstants.id2'),
  id3: ImageId('ImageTestConstants.id3'),
  name: 'ImageTestConstants.name',
  oldName: 'ImageTestConstants.oldName',
  newName: 'ImageTestConstants.newName',
  imageBytes: ImageBytes(new Uint8Array([1, 2, 3])),
}

export const makeImage = ({ id = newImageId(), name = ImageTestConstants.name, data }: Partial<Image> = {}): Image => ({
  id,
  name,
  data,
})

export const makeImageData = ({
  bytes = ImageTestConstants.imageBytes,
  mediaType = JPEG_MEDIA_TYPE,
  crop = undefined,
}: Partial<ImageData> = {}): ImageData => ({
  bytes,
  mediaType,
  crop,
})

export const makeImageCrop = ({
  x = Percent(0),
  y = Percent(0),
  size = Percent(100),
}: Partial<ImageCrop> = {}): ImageCrop => ({
  x,
  y,
  size,
})
