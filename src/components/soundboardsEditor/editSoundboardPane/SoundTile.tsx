import { getSoundDisplayName, Sound, soundHasAudio } from '../../../types/Sound.ts'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { Button, DialogTrigger, Toolbar } from 'react-aria-components'
import { mdiClose, mdiKeyboard, mdiPencil } from '@mdi/js'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { useNavigate } from 'react-router-dom'
import { editSoundRoute } from '../../routes.ts'
import { PlaySoundButton } from './PlaySoundButton.tsx'
import { SoundTileIconButton } from './SoundTileIconButton.tsx'
import { Modal } from '../../shared/Modal.tsx'
import { ChooseShortcutDialog } from './ChooseShortcutDialog.tsx'
import { useSoundTileGridStore } from './soundTileGridStore.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { KeyboardShortcut } from '../../../types/KeyboardShortcut.ts'
import { Option } from '../../../utils/types/Option.ts'
import Icon from '@mdi/react'

export interface SoundTileProps {
  soundboardId: SoundboardId
  shortcut: Option<KeyboardShortcut>
  sound: Sound
}

export const SoundTile = ({ soundboardId, sound, shortcut }: SoundTileProps) => {
  const soundActions = useSoundActions()
  const navigate = useNavigate()
  const { setShowingDialog } = useSoundTileGridStore()
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
    soundActions.removeSoundFromSoundboard(soundboardId, sound.id)
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
      className="relative flex aspect-square flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-50 shadow-md hover:bg-gray-100"
    >
      <>
        <DialogTrigger onOpenChange={(isOpen) => setShowingDialog(isOpen)}>
          <Button
            className="absolute right-0 top-0 m-2 rounded bg-gray-800 p-1 px-1 py-1 text-xs text-white hover:bg-blue-500 focus:bg-blue-600"
            aria-label={`Edit shortcut for sound ${getSoundDisplayName(sound)}`}
          >
            {shortcut ?? (
              <Icon title={`Edit shortcut for sound ${getSoundDisplayName(sound)}`} path={mdiKeyboard} size={1} />
            )}
          </Button>
          <Modal>
            <ChooseShortcutDialog soundboardId={soundboardId} soundId={sound.id} />
          </Modal>
        </DialogTrigger>
      </>
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
