import { getSoundDisplayName, Sound, soundHasAudio } from '../../../types/Sound.ts'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { Toolbar } from 'react-aria-components'
import { mdiKeyboard, mdiPencil, mdiTrashCan } from '@mdi/js'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { useNavigate } from 'react-router-dom'
import { editSoundRoute } from '../../routes.ts'
import { PlaySoundButton } from './PlaySoundButton.tsx'
import { SoundTileButton } from './SoundTileButton.tsx'

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
  const handleEditShortcut = () => undefined
  return (
    <div
      data-testid={EditSoundboardPaneTestIds.soundTile}
      ref={setRef}
      style={style}
      {...listeners}
      {...attributes}
      className="flex aspect-square flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-50 shadow-md hover:bg-gray-100"
    >
      <div className="flex flex-grow items-center justify-center text-center">{getSoundDisplayName(sound)}</div>
      <div className="flex w-full justify-center bg-blue-200 pb-1 pt-2">
        <Toolbar>
          {soundHasAudio(sound) && <PlaySoundButton sound={sound} />}
          <SoundTileButton
            testId={EditSoundboardPaneTestIds.editSoundButton}
            ariaLabel={`Edit sound ${getSoundDisplayName(sound)}`}
            icon={mdiPencil}
            onPress={handleEdit}
          />
          <SoundTileButton
            testId={EditSoundboardPaneTestIds.removeSoundButton}
            ariaLabel={`Remove sound ${getSoundDisplayName(sound)} from the soundboard`}
            icon={mdiTrashCan}
            onPress={handleRemoveSound}
          />
          <SoundTileButton
            testId={EditSoundboardPaneTestIds.editShortcutButton}
            ariaLabel={`Edit shortcut for sound ${getSoundDisplayName(sound)}`}
            icon={mdiKeyboard}
            onPress={handleEditShortcut}
          />
        </Toolbar>
      </div>
    </div>
  )
}
