import { useSoundActions, useSoundboard } from '../../../sounds/soundHooks.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { SoundboardNameTextField } from '../SoundboardNameTextField.tsx'

export interface EditSoundboardPaneProps {
  soundboardId: SoundboardId
}

export const EditSoundboardPaneContents = ({ soundboardId }: EditSoundboardPaneProps) => {
  const soundboard = useSoundboard(soundboardId)
  const soundActions = useSoundActions()
  const setSoundboardName = (name: string) => soundActions.setSoundboardName(soundboard.id, name)
  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <SoundboardNameTextField name={soundboard.name} setName={setSoundboardName} />
    </div>
  )
}
