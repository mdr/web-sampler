import { useSoundboard, useSoundboardActions } from '../../../sounds/library/soundHooks.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { SoundboardNameTextField } from '../SoundboardNameTextField.tsx'
import { AddSoundButton } from './AddSoundButton.tsx'
import { DeleteSoundboardButton } from './DeleteSoundboardButton.tsx'
import { SoundTileGrid } from './SoundTileGrid.tsx'

export interface EditSoundboardPaneContentsProps {
  soundboardId: SoundboardId
}

export const EditSoundboardPaneContents = ({ soundboardId }: EditSoundboardPaneContentsProps) => {
  const soundboardActions = useSoundboardActions()
  const soundboard = useSoundboard(soundboardId)
  const setSoundboardName = (name: string) => soundboardActions.setSoundboardName(soundboardId, name)
  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <SoundboardNameTextField name={soundboard.name} setName={setSoundboardName} />
      <div className="flex space-x-2">
        <AddSoundButton soundboardId={soundboardId} />
        <DeleteSoundboardButton soundboardId={soundboardId} />
      </div>
      <SoundTileGrid soundboardId={soundboardId} />
    </div>
  )
}
