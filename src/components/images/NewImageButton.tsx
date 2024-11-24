import { mdiPlus } from '@mdi/js'

import { useImageActions } from '../../sounds/library/soundHooks.ts'
import { useNavigate } from '../../utils/hooks/useNavigate.ts'
import { TestId } from '../../utils/types/brandedTypes.ts'
import { Routes } from '../app/routes.ts'
import { Button } from '../shared/Button.tsx'
import { ButtonVariant } from '../shared/ButtonVariant.tsx'

export interface NewImageButtonProps {
  testId?: TestId
}

export const NewImageButton = ({ testId }: NewImageButtonProps) => {
  const imageActions = useImageActions()
  const navigate = useNavigate()
  const handlePress = () => {
    const image = imageActions.newImage()
    navigate(Routes.editImage(image.id))
  }
  return (
    <Button variant={ButtonVariant.PRIMARY} testId={testId} icon={mdiPlus} label="New Image" onPress={handlePress} />
  )
}
