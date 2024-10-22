import { Image, ImageId, newImageId } from './Image.ts'

export const ImageTestConstants = {
  id: ImageId('ImageTestConstants.id'),
  id2: ImageId('ImageTestConstants.id2'),
  id3: ImageId('ImageTestConstants.id3'),
  name: 'ImageTestConstants.name',
  oldName: 'ImageTestConstants.oldName',
  newName: 'ImageTestConstants.newName',
}

export const makeImage = ({ id = newImageId(), name = ImageTestConstants.name }: Partial<Image> = {}): Image => ({
  id,
  name,
})
