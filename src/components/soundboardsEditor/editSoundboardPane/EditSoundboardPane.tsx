import { useIsLoading, useMaybeSoundboard } from '../../../sounds/soundHooks.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { EditSoundboardPaneContents } from './EditSoundboardPaneContents.tsx'
import { SoundboardNotFound } from './SoundboardNotFound.tsx'

export interface EditSoundboardPaneProps {
  soundboardId: SoundboardId
}

export const EditSoundboardPane = ({ soundboardId }: EditSoundboardPaneProps) => {
  const soundboard = useMaybeSoundboard(soundboardId)
  const isLoading = useIsLoading()
  if (isLoading) {
    return undefined
  }
  if (soundboard === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <SoundboardNotFound />
      </div>
    )
  }
  return <EditSoundboardPaneContents soundboardId={soundboard.id} />
}
