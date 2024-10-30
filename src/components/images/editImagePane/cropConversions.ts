import { PercentCrop } from 'react-image-crop'

import { ImageCrop } from '../../../types/Image.ts'
import { Percent } from '../../../utils/types/brandedTypes.ts'

export const imageCropToPercentCrop = (crop: ImageCrop): PercentCrop => ({
  unit: '%',
  x: crop.x,
  y: crop.y,
  width: crop.width,
  height: crop.height,
})

export const percentCropToImageCrop = (crop: PercentCrop): ImageCrop => ({
  x: Percent(crop.x),
  y: Percent(crop.y),
  width: Percent(crop.width),
  height: Percent(crop.height),
})
