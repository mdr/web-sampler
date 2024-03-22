import { SoundId } from '../../../types/Sound.ts'
import { useIsLoading, useMaybeSound } from '../../../sounds/soundHooks.ts'
import { EditSoundPaneContents } from './EditSoundPaneContents.tsx'
import { SoundNotFound } from './SoundNotFound.tsx'

export interface EditSoundPaneProps {
  soundId: SoundId
}

export const EditSoundPane = ({ soundId }: EditSoundPaneProps) => {
  const sound = useMaybeSound(soundId)
  const isLoading = useIsLoading()
  if (isLoading) {
    return undefined
  }
  if (sound === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <SoundNotFound />
      </div>
    )
  }
  return <EditSoundPaneContents soundId={sound.id} />
}
