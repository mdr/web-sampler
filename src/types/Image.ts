import { Brand } from 'effect'

import { displayCollator } from '../utils/sortUtils.ts'

export type ImageId = string & Brand.Brand<'ImageId'>

export const ImageId = Brand.nominal<ImageId>()

export interface Image {
  id: ImageId
  name: string
}

export const getImageDisplayName = (image: Image): string => imageNameAsDisplayName(image.name)

export const imageNameAsDisplayName = (name: string): string => (name.trim() === '' ? 'Untitled Image' : name)

export const sortImagesByDisplayName = (images: readonly Image[]): Image[] =>
  [...images].sort((image1, image2) =>
    displayCollator.compare(getImageDisplayName(image1), getImageDisplayName(image2)),
  )
