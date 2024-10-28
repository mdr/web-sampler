import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Fragment, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { ResizePayload } from 'react-resize-detector/build/types/types'

import { useSoundboardActions, useSoundboardAndSounds } from '../../../sounds/library/soundHooks.ts'
import { SoundId } from '../../../types/Sound.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { Option } from '../../../utils/types/Option.ts'
import { PlaceholderTile } from './PlaceholderTile.tsx'
import { SoundTile } from './SoundTile.tsx'
import { SOUND_TILE_GAP, SOUND_TILE_SIZE } from './soundTileConstants.ts'
import { useSoundTileGridStore } from './soundTileGridStore.ts'

export interface SoundTileGridContentsProps {
  soundboardId: SoundboardId
}

export const SoundTileGrid = ({ soundboardId }: SoundTileGridContentsProps) => {
  const soundboardActions = useSoundboardActions()
  const { soundboard, tiles } = useSoundboardAndSounds(soundboardId)
  const [columns, setColumns] = useState(1)
  const [sourceSoundId, setSourceSoundId] = useState<Option<SoundId>>(undefined)
  const [targetSoundId, setTargetSoundId] = useState<Option<SoundId>>(undefined)
  // Explicitly set up sensors else Playwright test interactions don't work correctly:
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor), useSensor(KeyboardSensor))
  const isShowingDialog = useSoundTileGridStore((state) => state.isShowingDialog)

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
      soundboardActions.moveSoundInSoundboard(soundboard.id, sourceSoundId, targetSoundId)
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

  const sourceTile = tiles.find((tile) => tile.soundId === sourceSoundId)
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={handleDragCancel}
      sensors={isShowingDialog ? [] : sensors}
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
        {tiles.map((tile) => (
          <Fragment key={tile.soundId}>
            {targetSoundId === tile.soundId && <PlaceholderTile />}
            {tile.soundId !== sourceSoundId && (
              <SoundTile soundboardId={soundboardId} sound={tile.sound} shortcut={tile.shortcut} />
            )}
          </Fragment>
        ))}
        {targetSoundId === undefined && sourceSoundId !== undefined && (
          <PlaceholderTile fudgeHeight={tiles.length % columns === 1} />
        )}
      </div>
      <DragOverlay>
        {sourceTile !== undefined && (
          <SoundTile soundboardId={soundboardId} sound={sourceTile.sound} shortcut={sourceTile.shortcut} />
        )}
      </DragOverlay>
    </DndContext>
  )
}
