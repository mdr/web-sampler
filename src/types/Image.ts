import { Brand } from 'effect'
import * as uuid from 'uuid'
import { z } from 'zod'

import { displayCollator } from '../utils/sortUtils.ts'
import { ImageBytes, MediaType, Percent } from '../utils/types/brandedTypes.ts'

export type ImageId = string & Brand.Brand<'ImageId'>

export const ImageId = Brand.nominal<ImageId>()

export const newImageId = (): ImageId => ImageId(uuid.v4())

export interface ImageCrop {
  readonly x: Percent
  readonly y: Percent
  readonly width: Percent
  readonly height: Percent
}

export const imageCropSchema = z
  .strictObject({
    x: z.number().transform(Percent),
    y: z.number().transform(Percent),
    width: z.number().transform(Percent),
    height: z.number().transform(Percent),
  })
  .readonly()

export interface ImageData {
  readonly bytes: ImageBytes
  readonly mediaType: MediaType
  readonly crop?: ImageCrop
}

export const imageDataSchema = z
  .strictObject({
    bytes: z.instanceof(Uint8Array).transform(ImageBytes),
    mediaType: z.string().transform(MediaType),
    crop: imageCropSchema.optional(),
  })
  .readonly()

export interface Image {
  readonly id: ImageId
  readonly name: string
  readonly data?: ImageData
}

export const imageSchema = z
  .strictObject({
    id: z.string().transform(ImageId),
    name: z.string(),
    data: imageDataSchema.optional(),
  })
  .readonly()

export const getImageDisplayName = (image: Image): string => imageNameAsDisplayName(image.name)

export const imageNameAsDisplayName = (name: string): string => (name.trim() === '' ? 'Untitled Image' : name)

export const sortImagesByDisplayName = (images: readonly Image[]): Image[] =>
  [...images].sort((image1, image2) =>
    displayCollator.compare(getImageDisplayName(image1), getImageDisplayName(image2)),
  )

export const newImage = (): Image => ({ id: newImageId(), name: '' })
