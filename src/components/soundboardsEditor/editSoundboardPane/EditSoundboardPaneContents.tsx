import { useSoundActions, useSoundboard } from '../../../sounds/soundHooks.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { SoundboardNameTextField } from '../SoundboardNameTextField.tsx'
import { Button, ButtonVariant } from '../../shared/Button.tsx'
import { mdiViewGridPlusOutline } from '@mdi/js'
import { EditSoundboardPaneTestIds } from '../EditSoundboardPaneTestIds.ts'

export interface EditSoundboardPaneProps {
  soundboardId: SoundboardId
}

export const EditSoundboardPaneContents = ({ soundboardId }: EditSoundboardPaneProps) => {
  const soundboard = useSoundboard(soundboardId)
  const soundActions = useSoundActions()
  const setSoundboardName = (name: string) => soundActions.setSoundboardName(soundboard.id, name)
  return (
    <div className="flex flex-col space-y-4  px-4 pt-4">
      <SoundboardNameTextField name={soundboard.name} setName={setSoundboardName} />
      <div className="flex justify-center">
        <AddSoundButton />
      </div>
    </div>
  )
}

export const AddSoundButton = () => {
  const handlePress = () => {}
  return (
    <Button
      variant={ButtonVariant.PRIMARY}
      testId={EditSoundboardPaneTestIds.addSoundButton}
      icon={mdiViewGridPlusOutline}
      label="Add Sound"
      onPress={handlePress}
    />
  )
}
