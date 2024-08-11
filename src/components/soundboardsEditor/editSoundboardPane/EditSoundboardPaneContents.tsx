import { useSoundActions, useSoundboard } from '../../../sounds/library/soundHooks.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { SoundboardNameTextField } from '../SoundboardNameTextField.tsx'
import { AddSoundButton } from './AddSoundButton.tsx'
import { SoundTileGrid } from './SoundTileGrid.tsx'

export interface EditSoundboardPaneContentsProps {
  soundboardId: SoundboardId
}

export const EditSoundboardPaneContents = ({ soundboardId }: EditSoundboardPaneContentsProps) => {
  const soundActions = useSoundActions()
  const soundboard = useSoundboard(soundboardId)
  const setSoundboardName = (name: string) => soundActions.setSoundboardName(soundboardId, name)
  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <SoundboardNameTextField name={soundboard.name} setName={setSoundboardName} />
      <div className="flex justify-center">
        <AddSoundButton soundboardId={soundboardId} />
      </div>
      <SoundTileGrid soundboardId={soundboardId} />
    </div>
  )
}
