import Konva from 'konva'
import { Vector2d } from 'konva/lib/types'
import { useCallback } from 'react'
import { Group, Line, Rect, RegularPolygon } from 'react-konva'

import { Option } from '../../../utils/types/Option.ts'
import { Pixels } from '../../../utils/types/brandedTypes.ts'
import { Case, Default, Switch } from '../../misc/Switch.tsx'
import { CANVAS_HEIGHT } from './waveformConstants.ts'

const HANDLE_RADIUS = Pixels(10)
const DRAG_TARGET_WIDTH = Pixels(16)

const Triangle = ({ x, y, rotation }: { x: Pixels; y: Pixels; rotation: number }) => (
  <RegularPolygon x={x} y={y} sides={3} radius={HANDLE_RADIUS} rotation={rotation} fill="#000000" />
)

export interface DraggableTimeBoundaryProps {
  x: Pixels
  xMax: Pixels
  dragMin: Pixels
  dragMax: Pixels

  onPositionChanged(x: Pixels): void

  onPositionChangedTemporarily(x: Option<Pixels>): void
}

export const DraggableTimeBoundary = ({
  x,
  xMax,
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

  const constrainDrag = useCallback(
    (vector: Vector2d): Vector2d => {
      const xOffset = vector.x
      const xAbsolute = xOffset + x
      const constrainedXAbsolute = Math.max(dragMin, Math.min(xAbsolute, dragMax))
      const constrainedXOffset = constrainedXAbsolute - x
      return { x: constrainedXOffset, y: 0 }
    },
    [dragMin, x, dragMax],
  )

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

      {/* Marker/flag */}
      <Switch>
        <Case condition={x <= HANDLE_RADIUS}>
          <Triangle
            x={Pixels(x + HANDLE_RADIUS / 2 + 1)}
            y={Pixels((HANDLE_RADIUS * Math.sqrt(3)) / 2)}
            rotation={90}
          />
        </Case>
        <Case condition={x >= xMax - HANDLE_RADIUS}>
          <Triangle
            x={Pixels(x - HANDLE_RADIUS / 2 - 1)}
            y={Pixels((HANDLE_RADIUS * Math.sqrt(3)) / 2)}
            rotation={-90}
          />
        </Case>
        <Default>
          <Triangle x={x} y={Pixels(HANDLE_RADIUS / 2)} rotation={180} />
        </Default>
      </Switch>

      {/* Line showing position */}
      <Line
        // tweak by 1 pixel at the extreme right to ensure the line is visible
        points={[Math.min(x, xMax - 1), 0, Math.min(x, xMax - 1), CANVAS_HEIGHT]}
        stroke="#000000"
        strokeWidth={1}
      />
    </Group>
  )
}
