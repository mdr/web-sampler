import { useSoundActions, useSoundboardAndSounds } from '../../../sounds/library/soundHooks.ts'
import { Fragment, useState } from 'react'
import { Option } from '../../../utils/types/Option.ts'
import { SoundId } from '../../../types/Sound.ts'
import { ResizePayload } from 'react-resize-detector/build/types/types'
import { useResizeDetector } from 'react-resize-detector'
import { DndContext, DragOverEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core'
import { PlaceholderTile } from './PlaceholderTile.tsx'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { SoundTile } from './SoundTile.tsx'
import { SOUND_TILE_GAP, SOUND_TILE_SIZE } from './soundTileConstants.ts'

export interface SoundTileGridContentsProps {
  soundboardId: SoundboardId
}

export const SoundTileGrid = ({ soundboardId }: SoundTileGridContentsProps) => {
  const soundActions = useSoundActions()
  const { soundboard, sounds } = useSoundboardAndSounds(soundboardId)
  const [columns, setColumns] = useState(1)
  const [sourceSoundId, setSourceSoundId] = useState<Option<SoundId>>(undefined)
  const [targetSoundId, setTargetSoundId] = useState<Option<SoundId>>(undefined)

  const onResize = ({ width }: ResizePayload) => {
    if (width) {
      const newColumns = Math.floor((width + SOUND_TILE_GAP) / (SOUND_TILE_SIZE + SOUND_TILE_GAP))
      setColumns(newColumns > 0 ? newColumns : 1)
    }
  }

  const { ref } = useResizeDetector({ onResize })

  const handleDragStart = (event: DragStartEvent) => {
    const sourceSoundId = event.active.id as SoundId
    setSourceSoundId(sourceSoundId)
  }

  const handleDragEnd = () => {
    if (sourceSoundId !== undefined) {
      soundActions.moveSoundInSoundboard2(soundboard.id, sourceSoundId, targetSoundId)
    }
    setSourceSoundId(undefined)
    setTargetSoundId(undefined)
  }

  const handleDragCancel = () => {
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
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
    >
      <div
        ref={ref}
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${SOUND_TILE_SIZE}px)`,
          columnGap: `${SOUND_TILE_GAP}px`,
          rowGap: `${SOUND_TILE_GAP}px`,
        }}
      >
        {sounds.map((sound) => (
          <Fragment key={sound.id}>
            {targetSoundId === sound.id && <PlaceholderTile />}
            {sound.id !== sourceSoundId && <SoundTile sound={sound} />}
          </Fragment>
        ))}
        {targetSoundId === undefined && sourceSoundId !== undefined && (
          <PlaceholderTile fudgeHeight={sounds.length % columns === 1} />
        )}
      </div>
      <DragOverlay>{sourceSound ? <SoundTile sound={sourceSound} /> : undefined}</DragOverlay>
    </DndContext>
  )
}
