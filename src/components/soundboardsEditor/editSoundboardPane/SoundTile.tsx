import { getSoundDisplayName, Sound } from '../../../types/Sound.ts'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { Button, Toolbar } from 'react-aria-components'
import Icon from '@mdi/react'
import { mdiPencil, mdiPlay, mdiTrashCan } from '@mdi/js'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { useNavigate } from 'react-router-dom'
import { editSoundRoute } from '../../routes.ts'

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
  const handleDelete = () => {
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
      <div className="flex flex-grow items-center justify-center text-center">{getSoundDisplayName(sound)}</div>
      <div className="flex w-full justify-center bg-blue-200 pb-1 pt-2">
        <Toolbar>
          <Button
            data-testid={EditSoundboardPaneTestIds.playSoundButton}
            className="rounded px-1 py-1 hover:bg-blue-300 focus:bg-blue-400"
            aria-label={`Play sound ${getSoundDisplayName(sound)}`}
          >
            <Icon path={mdiPlay} size={1} />
          </Button>
          <Button
            data-testid={EditSoundboardPaneTestIds.editSoundButton}
            className="rounded px-1 py-1 hover:bg-blue-300 focus:bg-blue-400"
            onPress={handleEdit}
            aria-label={`Edit sound ${getSoundDisplayName(sound)}`}
          >
            <Icon path={mdiPencil} size={1} />
          </Button>
          <Button
            data-testid={EditSoundboardPaneTestIds.deleteSoundButton}
            className="rounded px-1 py-1 hover:bg-blue-300 focus:bg-blue-400"
            onPress={handleDelete}
            aria-label={`Delete sound ${getSoundDisplayName(sound)}`}
          >
            <Icon path={mdiTrashCan} size={1} />
          </Button>
        </Toolbar>
      </div>
    </div>
  )
}
