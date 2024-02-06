import { SoundId } from '../../types/Sound.ts'
import { useMaybeSound } from '../../sounds/soundHooks.ts'
import { EditSoundPaneContents } from './EditSoundPaneContents.tsx'
import { SoundNotFound } from './SoundNotFound.tsx'

export interface EditSoundPaneProps {
  soundId: SoundId
}

export const EditSoundPane = ({ soundId }: EditSoundPaneProps) => {
  const sound = useMaybeSound(soundId)
  return sound === undefined ? (
    <div className="flex justify-center items-center h-full">
      <SoundNotFound />
    </div>
  ) : (
    <EditSoundPaneContents soundId={sound.id} />
  )
}
