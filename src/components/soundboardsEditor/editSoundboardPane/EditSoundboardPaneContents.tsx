import { useSoundActions, useSoundboardAndSounds } from '../../../sounds/library/soundHooks.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { SoundboardNameTextField } from '../SoundboardNameTextField.tsx'
import { AddSoundButton } from './AddSoundButton.tsx'
import { Fragment, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { ResizePayload } from 'react-resize-detector/build/types/types'
import { getSoundDisplayName, Sound, SoundId } from '../../../types/Sound.ts'
import { Pixels } from '../../../utils/types/brandedTypes.ts'
import { DndContext, DragOverEvent, DragOverlay, DragStartEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import clsx from 'clsx'
import { Option } from '../../../utils/types/Option.ts'

const SOUND_ITEM_SIZE = Pixels(100)

export interface EditSoundboardPaneContentsProps {
  soundboardId: SoundboardId
}

const SoundTile = ({ sound }: { sound: Sound }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: sound.id,
  })
  const { setNodeRef: setNodeRef2 } = useDroppable({
    id: sound.id,
  })
  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined
  const setRef = (element: HTMLElement | null) => {
    setNodeRef(element)
    setNodeRef2(element)
  }
  return (
    <div
      ref={setRef}
      style={style}
      {...listeners}
      {...attributes}
      className={clsx(
        'flex aspect-square h-24 w-24 flex-col items-center justify-center rounded-md border border-gray-200 bg-gray-50 shadow-md hover:bg-gray-100',
      )}
    >
      <div className="text-center">{getSoundDisplayName(sound)}</div>
    </div>
  )
}

export const EditSoundboardPaneContents = ({ soundboardId }: EditSoundboardPaneContentsProps) => {
  const soundActions = useSoundActions()
  const { soundboard, sounds } = useSoundboardAndSounds(soundboardId)
  const [columns, setColumns] = useState(1)
  const [sourceSoundId, setSourceSoundId] = useState<Option<SoundId>>(undefined)
  const [targetSoundId, setTargetSoundId] = useState<Option<SoundId>>(undefined)

  const onResize = ({ width }: ResizePayload) => {
    if (width) {
      const newColumns = Math.floor(width / SOUND_ITEM_SIZE)
      setColumns(newColumns > 0 ? newColumns : 1)
    }
  }

  const { ref } = useResizeDetector({ onResize })

  const handleDragStart = (event: DragStartEvent) => {
    const sourceSoundId = event.active.id as SoundId
    setSourceSoundId(sourceSoundId)
  }

  const handleDragEnd = () => {
    if (sourceSoundId !== undefined && targetSoundId !== undefined) {
      soundActions.moveSoundInSoundboard3(soundboard.id, sourceSoundId, targetSoundId)
    }
    setSourceSoundId(undefined)
    setTargetSoundId(undefined)
  }

  const handleDragOver = (event: DragOverEvent) => {
    if (event.over) {
      const targetSoundId = event.over.id as SoundId
      setTargetSoundId(targetSoundId)
    } else {
      setTargetSoundId(undefined)
    }
  }

  const sourceSound = sounds.find((sound) => sound.id === sourceSoundId)
  const setSoundboardName = (name: string) => soundActions.setSoundboardName(soundboard.id, name)
  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
      <div className="flex flex-col space-y-4 px-4 pt-4">
        <SoundboardNameTextField name={soundboard.name} setName={setSoundboardName} />
        <div className="flex justify-center">
          <AddSoundButton soundboardId={soundboardId} />
        </div>
        <div
          ref={ref}
          className="grid gap-x-4 gap-y-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {sounds.map((sound) => (
            <Fragment key={sound.id}>
              {targetSoundId === sound.id && <PlaceholderTile />}
              {sound.id !== sourceSoundId && <SoundTile sound={sound} />}
            </Fragment>
          ))}
          {targetSoundId === undefined && sourceSoundId !== undefined && <PlaceholderTile />}
        </div>
      </div>
      <DragOverlay>{sourceSound ? <SoundTile sound={sourceSound} /> : undefined}</DragOverlay>
    </DndContext>
  )
}

const PlaceholderTile = () => <div className="h-24 w-24 border-2 border-dashed border-gray-400 bg-blue-50"></div>
