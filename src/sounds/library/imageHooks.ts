import { Image, ImageId } from '../../types/Image.ts'
import { Option } from '../../utils/types/Option.ts'
import { useSoundLibraryState } from './soundHooks.ts'

export const useImages = (): readonly Image[] => useSoundLibraryState((state) => state.images)

export const useMaybeImage = (id: ImageId): Option<Image> => useImages().find((image) => image.id === id)

export const useImage = (id: ImageId): Image => {
  const image = useMaybeImage(id)
  if (image === undefined) {
    throw new Error(`no image found with id ${id}`)
  }
  return image
}
