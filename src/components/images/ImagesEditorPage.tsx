import { useIsLoading, useSoundboards } from '../../sounds/library/soundHooks.ts'
import { useImageIdParam } from '../routeHooks.ts'
import { EditOrCreateImageMessage } from './EditOrCreateImageMessage.tsx'
import { ImagesEditorPageLayout } from './ImagesEditorPageLayout.tsx'
import { NoImagesMessage } from './NoImagesMessage.tsx'
import { EditImagePane } from './editImagePane/EditImagePane.tsx'

export const ImagesEditorPage = () => {
  const imageId = useImageIdParam()
  const soundboards = useSoundboards()
  const isLoading = useIsLoading()
  if (isLoading) {
    return undefined
  }
  return (
    <ImagesEditorPageLayout>
      {imageId === undefined ? (
        soundboards.length === 0 ? (
          <NoImagesMessage />
        ) : (
          <EditOrCreateImageMessage />
        )
      ) : (
        <EditImagePane key={imageId} imageId={imageId} />
      )}
    </ImagesEditorPageLayout>
  )
}
