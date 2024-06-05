import { useSoundActions, useSoundboard, useSounds } from '../../../sounds/soundHooks.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { SoundboardNameTextField } from '../SoundboardNameTextField.tsx'
import { Button } from '../../shared/Button.tsx'
import { mdiViewGridPlusOutline } from '@mdi/js'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { DialogTrigger } from 'react-aria-components'
import { Modal } from '../../shared/Modal.tsx'
import { ChooseSoundDialog } from './ChooseSoundDialog.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { GridContextProvider, GridDropZone, GridItem } from 'react-grid-dnd'
import { getSoundDisplayName, Sound } from '../../../types/Sound.ts'

export interface EditSoundboardPaneContentsProps {
  soundboardId: SoundboardId
}

export const EditSoundboardPaneContents = ({ soundboardId }: EditSoundboardPaneContentsProps) => {
  const soundboard = useSoundboard(soundboardId)
  const soundActions = useSoundActions()
  const allSounds = useSounds()
  const sounds = soundboard.sounds.map((soundId) => allSounds.find((sound) => sound.id === soundId) as Sound)
  const onChange = (_: string, sourceIndex: number, targetIndex: number) => {
    // Account for dragging past the last item in the list
    const actualTargetIndex = Math.min(targetIndex, sounds.length - 1)
    soundActions.moveSoundInSoundboard(soundboardId, sourceIndex, actualTargetIndex)
  }
  const setSoundboardName = (name: string) => soundActions.setSoundboardName(soundboard.id, name)
  return (
    <div className="flex flex-col space-y-4 px-4 pt-4">
      <SoundboardNameTextField name={soundboard.name} setName={setSoundboardName} />
      <GridContextProvider onChange={onChange}>
        <GridDropZone id="items" boxesPerRow={4} rowHeight={100} style={{ height: '400px' }}>
          {sounds.map((sound) => (
            <GridItem key={sound?.id}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                }}
              >
                {getSoundDisplayName(sound)}
              </div>
            </GridItem>
          ))}
        </GridDropZone>
      </GridContextProvider>
      <div className="flex justify-center">
        <AddSoundButton soundboardId={soundboardId} />
      </div>
    </div>
  )
}

export interface AddSoundButtonProps {
  soundboardId: SoundboardId
}

export const AddSoundButton = ({ soundboardId }: AddSoundButtonProps) => {
  const handlePress = () => {}
  return (
    <DialogTrigger>
      <Button
        variant={ButtonVariant.PRIMARY}
        testId={EditSoundboardPaneTestIds.addSoundButton}
        icon={mdiViewGridPlusOutline}
        label="Add Sound"
        onPress={handlePress}
      />
      <Modal>
        <ChooseSoundDialog soundboardId={soundboardId} />
      </Modal>
    </DialogTrigger>
  )
}
