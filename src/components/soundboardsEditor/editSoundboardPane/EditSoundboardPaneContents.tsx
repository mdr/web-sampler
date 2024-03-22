import { useSoundboard } from '../../../sounds/soundHooks.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'

export interface EditSoundboardPaneProps {
  soundboardId: SoundboardId
}

export const EditSoundboardPaneContents = ({ soundboardId }: EditSoundboardPaneProps) => {
  const soundboard = useSoundboard(soundboardId)
  // const soundActions = useSoundActions()
  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      {/*<SoundNameTextField soundName={sound.name} setSoundName={setSoundName} />*/}
      {soundboard.name}
    </div>
  )
}
