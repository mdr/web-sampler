import { Brand } from 'effect'
import * as uuid from 'uuid'
import { z } from 'zod'

import { displayCollator } from '../utils/sortUtils.ts'

export type ImageId = string & Brand.Brand<'ImageId'>

export const ImageId = Brand.nominal<ImageId>()

export const newImageId = (): ImageId => ImageId(uuid.v4())

export interface Image {
  readonly id: ImageId
  readonly name: string
}

export const imageSchema = z
  .strictObject({
    id: z.string().transform(ImageId),
    name: z.string(),
  })
  .readonly()

export const getImageDisplayName = (image: Image): string => imageNameAsDisplayName(image.name)

export const imageNameAsDisplayName = (name: string): string => (name.trim() === '' ? 'Untitled Image' : name)

export const sortImagesByDisplayName = (images: readonly Image[]): Image[] =>
  [...images].sort((image1, image2) =>
    displayCollator.compare(getImageDisplayName(image1), getImageDisplayName(image2)),
  )

export const newImage = (): Image => ({ id: newImageId(), name: '' })
