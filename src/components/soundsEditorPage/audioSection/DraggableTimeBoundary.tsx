import { Pixels, Seconds } from '../../../utils/types/brandedTypes.ts'
import { useCallback } from 'react'
import Konva from 'konva'
import { Group, Line, Rect, RegularPolygon } from 'react-konva'
import { CANVAS_HEIGHT } from './waveformConstants.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Vector2d } from 'konva/lib/types'

const HANDLE_RADIUS = Pixels(10)
const DRAG_TARGET_WIDTH = Pixels(16)

export interface DraggableTimeBoundaryProps {
  time: Seconds
  audioDuration: Seconds
  width: Pixels
  dragMin: Pixels
  dragMax: Pixels

  onTimeChanged(time: Seconds): void

  onTimeChangedTemporarily(time: Option<Seconds>): void
}

export const DraggableTimeBoundary = ({
  time,
  audioDuration,
  width,
  dragMin,
  dragMax,
  onTimeChanged,
  onTimeChangedTemporarily,
}: DraggableTimeBoundaryProps) => {
  const toSeconds = useCallback((x: Pixels): Seconds => Seconds((x / width) * audioDuration), [audioDuration, width])
  const toPixels = useCallback(
    (seconds: Seconds): Pixels => Pixels((seconds / audioDuration) * width),
    [audioDuration, width],
  )
  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const xOffset = Pixels(e.target.x())
      const secondsOffset = toSeconds(xOffset)
      onTimeChangedTemporarily(Seconds(time + secondsOffset))
    },
    [onTimeChangedTemporarily, time, toSeconds],
  )

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const xOffset = Pixels(e.target.x())
      const secondsOffset = toSeconds(xOffset)
      const newStartTime = Seconds(time + secondsOffset)
      e.target.position({ x: 0, y: 0 }) // Resets the drag translation
      onTimeChangedTemporarily(undefined)
      onTimeChanged(newStartTime)
    },
    [onTimeChanged, onTimeChangedTemporarily, time, toSeconds],
  )
  const changeCursor = (cursorType: 'grab' | 'default') => (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage() ?? undefined
    if (stage === undefined) return
    stage.container().style.cursor = cursorType
  }

  const constrainDrag = (vector: Vector2d): Vector2d => {
    const xOffset = vector.x
    const xAbsolute = xOffset + x
    const constrainedXAbsolute = Math.max(dragMin, Math.min(xAbsolute, dragMax))
    const constrainedXOffset = constrainedXAbsolute - x
    return { x: constrainedXOffset, y: 0 }
  }

  const x = toPixels(time)
  return (
    <Group
      draggable
      onMouseEnter={changeCursor('grab')}
      onMouseLeave={changeCursor('default')}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      dragBoundFunc={constrainDrag}
    >
      {/* Invisible drag target rectangle */}
      <Rect
        x={x - DRAG_TARGET_WIDTH / 2}
        y={0}
        width={DRAG_TARGET_WIDTH}
        height={CANVAS_HEIGHT}
        fill="transparent"
        stroke="transparent"
      />
      <RegularPolygon x={x} y={HANDLE_RADIUS / 2} sides={3} radius={HANDLE_RADIUS} rotation={180} fill="#000000" />
      <RegularPolygon
        x={x}
        y={CANVAS_HEIGHT - HANDLE_RADIUS / 2}
        sides={3}
        radius={HANDLE_RADIUS}
        rotation={0}
        fill="#000000"
      />
      <Line points={[x, 0, x, CANVAS_HEIGHT]} stroke="#000000" strokeWidth={2} />
    </Group>
  )
}
