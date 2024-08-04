import { getSoundDisplayName, Sound, soundHasAudio } from '../../../types/Sound.ts'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { DialogTrigger, Toolbar } from 'react-aria-components'
import { mdiClose, mdiKeyboard, mdiPencil } from '@mdi/js'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { useNavigate } from 'react-router-dom'
import { editSoundRoute } from '../../routes.ts'
import { PlaySoundButton } from './PlaySoundButton.tsx'
import { SoundTileIconButton } from './SoundTileIconButton.tsx'
import { Modal } from '../../shared/Modal.tsx'
import { ShortcutDialog } from './ShortcutDialog.tsx'

export interface SoundTileProps {
  sound: Sound
}

export const SoundTile = ({ sound }: SoundTileProps) => {
  const soundActions = useSoundActions()
  const navigate = useNavigate()

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: sound.id,
  })
  const { setNodeRef: setNodeRef2 } = useDroppable({ id: sound.id })
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined
  const setRef = (element: HTMLElement | null) => {
    setNodeRef(element)
    setNodeRef2(element)
  }
  const handleRemoveSound = () => {
    soundActions.deleteSound(sound.id)
  }
  const handleEdit = () => {
    navigate(editSoundRoute(sound.id))
  }
  return (
    <div
      data-testid={EditSoundboardPaneTestIds.soundTile}
      ref={setRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex aspect-square flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-50 shadow-md hover:bg-gray-100"
    >
      <div
        data-testid={EditSoundboardPaneTestIds.soundTileName}
        className="flex flex-grow items-center justify-center text-center"
      >
        {getSoundDisplayName(sound)}
      </div>
      <div className="flex w-full justify-center bg-blue-200 pb-1 pt-2">
        <Toolbar>
          {soundHasAudio(sound) && <PlaySoundButton sound={sound} />}
          <SoundTileIconButton
            testId={EditSoundboardPaneTestIds.editSoundButton}
            label={`Edit sound ${getSoundDisplayName(sound)}`}
            icon={mdiPencil}
            onPress={handleEdit}
          />
          <DialogTrigger>
            <SoundTileIconButton
              testId={EditSoundboardPaneTestIds.editShortcutButton}
              label={`Edit shortcut for sound ${getSoundDisplayName(sound)}`}
              icon={mdiKeyboard}
            />
            <Modal>
              <ShortcutDialog />
            </Modal>
          </DialogTrigger>
          <SoundTileIconButton
            testId={EditSoundboardPaneTestIds.removeSoundButton}
            label={`Remove sound ${getSoundDisplayName(sound)} from the soundboard`}
            icon={mdiClose}
            onPress={handleRemoveSound}
          />
        </Toolbar>
      </div>
    </div>
  )
}
