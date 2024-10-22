import { mdiPlus } from '@mdi/js'
import { useNavigate } from 'react-router-dom'

import { useSoundActions } from '../../sounds/library/soundHooks.ts'
import { TestId } from '../../utils/types/brandedTypes.ts'
import { editImageRoute } from '../routes.ts'
import { Button } from '../shared/Button.tsx'
import { ButtonVariant } from '../shared/ButtonVariant.tsx'

export interface NewImageButtonProps {
  testId?: TestId
}

export const NewImageButton = ({ testId }: NewImageButtonProps) => {
  const soundActions = useSoundActions()
  const navigate = useNavigate()
  const handlePress = () => {
    const image = soundActions.newImage()
    navigate(editImageRoute(image.id))
  }
  return (
    <Button variant={ButtonVariant.PRIMARY} testId={testId} icon={mdiPlus} label="New Image" onPress={handlePress} />
  )
}
