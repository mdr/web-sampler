import { Pixels } from '../../../utils/types/brandedTypes.ts'
import { useCallback } from 'react'
import Konva from 'konva'
import { Group, Line, Rect, RegularPolygon } from 'react-konva'
import { CANVAS_HEIGHT } from './waveformConstants.ts'
import { Vector2d } from 'konva/lib/types'
import { Option } from '../../../utils/types/Option.ts'

const HANDLE_RADIUS = Pixels(10)
const DRAG_TARGET_WIDTH = Pixels(16)

export interface DraggableTimeBoundaryProps {
  x: Pixels
  dragMin: Pixels
  dragMax: Pixels

  onPositionChanged(x: Pixels): void

  onPositionChangedTemporarily(x: Option<Pixels>): void
}

export const DraggableTimeBoundary = ({
  x,
  dragMin,
  dragMax,
  onPositionChanged,
  onPositionChangedTemporarily,
}: DraggableTimeBoundaryProps) => {
  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const xOffset = Pixels(e.target.x())
      const temporaryX = Pixels(x + xOffset)
      onPositionChangedTemporarily(temporaryX)
    },
    [onPositionChangedTemporarily, x],
  )

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const xOffset = Pixels(e.target.x())
      const newX = Pixels(x + xOffset)
      e.target.position({ x: 0, y: 0 }) // Resets the drag translation
      onPositionChangedTemporarily(undefined)
      onPositionChanged(newX)
    },
    [onPositionChanged, onPositionChangedTemporarily, x],
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
      {x <= HANDLE_RADIUS ? (
        <RegularPolygon
          x={x + HANDLE_RADIUS / 2}
          y={(HANDLE_RADIUS * Math.sqrt(3)) / 2}
          sides={3}
          radius={HANDLE_RADIUS}
          rotation={90}
          fill="#000000"
        />
      ) : (
        <RegularPolygon x={x} y={HANDLE_RADIUS / 2} sides={3} radius={HANDLE_RADIUS} rotation={180} fill="#000000" />
      )}
      <Line points={[x, 0, x, CANVAS_HEIGHT]} stroke="#000000" strokeWidth={1} />
    </Group>
  )
}
