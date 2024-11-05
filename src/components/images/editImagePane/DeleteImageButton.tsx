import { mdiTrashCan } from '@mdi/js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { useImage } from '../../../sounds/library/imageHooks.ts'
import { useImageActions } from '../../../sounds/library/soundHooks.ts'
import { ImageId, getImageDisplayName } from '../../../types/Image.ts'
import { Routes } from '../../routes.ts'
import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { EditImagePaneTestIds } from './EditImagePaneTestIds.ts'

interface DeleteImageButtonProps {
  imageId: ImageId
}

export const DeleteImageButton = ({ imageId }: DeleteImageButtonProps) => {
  const image = useImage(imageId)
  const imageActions = useImageActions()
  const navigate = useNavigate()
  const onPress = () => {
    imageActions.deleteImage(imageId)
    navigate(Routes.sounds)
    toast.info(`Deleted sound ${getImageDisplayName(image)}`)
  }
  return (
    <Button
      testId={EditImagePaneTestIds.deleteButton}
      variant={ButtonVariant.DANGEROUS}
      icon={mdiTrashCan}
      label="Delete"
      onPress={onPress}
    />
  )
}
