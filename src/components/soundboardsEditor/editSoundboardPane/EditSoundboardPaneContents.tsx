import { useSoundActions, useSoundboardAndSounds } from '../../../sounds/library/soundHooks.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { SoundboardNameTextField } from '../SoundboardNameTextField.tsx'
import { GridContextProvider, GridDropZone, GridItem } from 'react-grid-dnd'
import { getSoundDisplayName } from '../../../types/Sound.ts'
import { AddSoundButton } from './AddSoundButton.tsx'

export interface EditSoundboardPaneContentsProps {
  soundboardId: SoundboardId
}

export const EditSoundboardPaneContents = ({ soundboardId }: EditSoundboardPaneContentsProps) => {
  const soundActions = useSoundActions()
  const { soundboard, sounds } = useSoundboardAndSounds(soundboardId)
  const onChange = (_: string, sourceIndex: number, targetIndex: number) => {
    // Account for dragging past the last item in the list
    const actualTargetIndex = Math.min(targetIndex, sounds.length - 1)
    soundActions.moveSoundInSoundboard(soundboardId, sourceIndex, actualTargetIndex)
  }
  const setSoundboardName = (name: string) => soundActions.setSoundboardName(soundboard.id, name)
  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <SoundboardNameTextField name={soundboard.name} setName={setSoundboardName} />
      <div className="flex justify-center">
        <AddSoundButton soundboardId={soundboardId} />
      </div>
      <GridContextProvider onChange={onChange}>
        <GridDropZone id="items" boxesPerRow={5} rowHeight={100} className="h-64">
          {sounds.map((sound) => (
            <GridItem key={sound.id}>
              <div className="flex h-full w-full items-center justify-center rounded-md border border-gray-200 bg-gray-50 shadow-md hover:bg-gray-100">
                {getSoundDisplayName(sound)}
              </div>
            </GridItem>
          ))}
        </GridDropZone>
      </GridContextProvider>
    </div>
  )
}
