import { Pixels, Seconds } from '../../../utils/types/brandedTypes.ts'
import { useCallback } from 'react'
import Konva from 'konva'
import { Circle, Group, Line } from 'react-konva'
import { CANVAS_HEIGHT } from './waveformConstants.ts'
import { Option } from '../../../utils/types/Option.ts'

const HANDLE_RADIUS = Pixels(5)

export interface DraggableTimeBoundaryProps {
  time: Seconds
  audioDuration: Seconds
  width: Pixels

  onTimeChanged(time: Seconds): void

  onTimeChangedTemporarily(time: Option<Seconds>): void
}

export const DraggableTimeBoundary = ({
  time,
  audioDuration,
  width,
  onTimeChanged,
  onTimeChangedTemporarily,
}: DraggableTimeBoundaryProps) => {
  const handleDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const xOffset = e.target.x()
      const secondsOffset = (xOffset / width) * audioDuration
      onTimeChangedTemporarily(Seconds(time + secondsOffset))
    },
    [audioDuration, onTimeChangedTemporarily, time, width],
  )

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const xOffset = e.target.x()
      const secondsOffset = (xOffset / width) * audioDuration
      const newStartTime = Seconds(time + secondsOffset)
      e.target.position({ x: 0, y: 0 }) // Resets the drag translation
      onTimeChangedTemporarily(undefined)
      onTimeChanged(newStartTime)
    },
    [audioDuration, onTimeChanged, time, width],
  )
  const x = (time / audioDuration) * width
  return (
    <Group
      draggable
      onMouseEnter={(e) => {
        const stage = e.target.getStage() ?? undefined
        if (stage === undefined) return
        stage.container().style.cursor = 'grab'
      }}
      onMouseLeave={(e) => {
        const stage = e.target.getStage() ?? undefined
        if (stage === undefined) return
        stage.container().style.cursor = 'default'
      }}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      dragBoundFunc={({ x }) => ({ x, y: 0 })}
    >
      <Circle x={x} y={HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
      <Circle x={x} y={CANVAS_HEIGHT - HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
      <Line points={[x, 0, x, CANVAS_HEIGHT]} stroke="#000000" strokeWidth={2} />
    </Group>
  )
}
