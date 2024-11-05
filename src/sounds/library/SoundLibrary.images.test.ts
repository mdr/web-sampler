import flushPromises from 'flush-promises'
import { expect, it } from 'vitest'

import { ImageData } from '../../types/Image.ts'
import { ImageTestConstants, makeImage, makeImageCrop, makeImageData } from '../../types/image.testSupport.ts'
import { makeSound } from '../../types/sound.testSupport.ts'
import { JPEG_MEDIA_TYPE } from '../../utils/types/brandedTypes.ts'
import { setUpTest } from './SoundLibrary.testSupport.ts'

it('should allow an image to be created', async () => {
  const { library, soundStore, listener } = await setUpTest()

  const image = library.newImage()

  expect(image.name).toEqual('')
  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.images).toEqual([image])
  await flushPromises()
  expect(soundStore.images).toEqual([image])
})

it('should allow an image to be deleted', async () => {
  const image = makeImage()
  const sound = makeSound({ image: image.id })
  const { library, soundStore, listener } = await setUpTest({ images: [image], sounds: [sound] })

  library.deleteImage(image.id)

  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.images).toEqual([])
  expect(library.getSound(sound.id).image).toBeUndefined()
  await flushPromises()
  expect(soundStore.images).toEqual([])
  expect(soundStore.getSound(sound.id).image).toBeUndefined()
})

it('should allow an image name to be changed', async () => {
  const image = makeImage({ name: ImageTestConstants.oldName })
  const { library, soundStore, listener } = await setUpTest({ images: [image] })

  library.setImageName(image.id, ImageTestConstants.newName)

  expect(listener).toHaveBeenCalledTimes(1)
  const updatedImages = [{ ...image, name: ImageTestConstants.newName }]
  expect(library.images).toEqual(updatedImages)
  await flushPromises()
  expect(soundStore.images).toEqual(updatedImages)
})

it('should allow image data to be set', async () => {
  const image = makeImage({ data: undefined })
  const { library, soundStore, listener } = await setUpTest({ images: [image] })

  library.setImageData(image.id, ImageTestConstants.imageBytes, JPEG_MEDIA_TYPE)

  expect(listener).toHaveBeenCalledTimes(1)
  const expectedImageData: ImageData = { bytes: ImageTestConstants.imageBytes, mediaType: JPEG_MEDIA_TYPE }
  expect(library.getImage(image.id).data).toEqual(expectedImageData)
  await flushPromises()
  expect(soundStore.getImage(image.id).data).toEqual(expectedImageData)
})

it('should allow image crop to be set', async () => {
  const image = makeImage({ data: makeImageData({ crop: undefined }) })
  const { library, soundStore, listener } = await setUpTest({ images: [image] })
  const imageCrop = makeImageCrop()

  library.setImageCrop(image.id, imageCrop)

  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.getImage(image.id).data?.crop).toEqual(imageCrop)
  await flushPromises()
  expect(soundStore.getImage(image.id).data?.crop).toEqual(imageCrop)
})
