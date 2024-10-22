import { useIsLoading, useMaybeImage } from '../../../sounds/library/soundHooks.ts'
import { ImageId } from '../../../types/Image.ts'
import { ImageNotFound } from '../ImageNotFound.tsx'
import { EditImagePaneContents } from './EditImagePaneContents.tsx'

export interface EditImagePaneProps {
  imageId: ImageId
}

export const EditImagePane = ({ imageId }: EditImagePaneProps) => {
  const image = useMaybeImage(imageId)
  const isLoading = useIsLoading()
  if (isLoading) {
    return undefined
  }
  if (image === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <ImageNotFound />
      </div>
    )
  }
  return <EditImagePaneContents imageId={image.id} />
}
