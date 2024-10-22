import { mdiPlus } from '@mdi/js'

import { TestId } from '../../utils/types/brandedTypes.ts'
import { Button } from '../shared/Button.tsx'
import { ButtonVariant } from '../shared/ButtonVariant.tsx'

export interface NewImageButtonProps {
  testId?: TestId
}

export const NewImageButton = ({ testId }: NewImageButtonProps) => {
  // const soundActions = useSoundActions()
  // const navigate = useNavigate()
  const handlePress = () => {
    // const soundboard = soundActions.newSoundboard()
    // navigate(editSoundboardRoute(soundboard.id))
  }
  return (
    <Button variant={ButtonVariant.PRIMARY} testId={testId} icon={mdiPlus} label="New Image" onPress={handlePress} />
  )
}
