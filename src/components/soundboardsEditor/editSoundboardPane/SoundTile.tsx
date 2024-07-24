import { getSoundDisplayName, Sound } from '../../../types/Sound.ts'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'

export interface SoundTileProps {
  sound: Sound
}

export const SoundTile = ({ sound }: SoundTileProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: sound.id,
  })
  const { setNodeRef: setNodeRef2 } = useDroppable({ id: sound.id })
  const style = transform ? { transform: CSS.Translate.toString(transform) } : undefined
  const setRef = (element: HTMLElement | null) => {
    setNodeRef(element)
    setNodeRef2(element)
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
      <div className="text-center">{getSoundDisplayName(sound)}</div>
      {/*<Button icon={mdiDotsVertical} iconOnly label={'Options'} />*/}
    </div>
  )
}
