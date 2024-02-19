import { Circle, Group, Layer, Line, Rect, Shape, Stage } from 'react-konva'
import { Pcm, Pixels, Seconds } from '../../../utils/types/brandedTypes.ts'
import { FC, useCallback, useState } from 'react'
import { useMeasure } from 'react-use'
import Konva from 'konva'

const HANDLE_RADIUS = Pixels(5)

const CANVAS_HEIGHT = Pixels(300)

export interface KonvaWaveformVisualiserProps {
  readonly pcm: Pcm
  startTime: Seconds
  finishTime: Seconds
  currentPosition: Seconds
  audioDuration: Seconds

  onStartTimeChanged(startTime: Seconds): void

  onFinishTimeChanged(finishTime: Seconds): void
}

interface DraggableTimeBoundaryProps {
  time: Seconds
  audioDuration: Seconds
  width: Pixels

  onTimeChanged(time: Seconds): void

  onTimeChangedTemporarily(time: Seconds): void
}

const DraggableTimeBoundary = ({
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

export const KonvaWaveformVisualiser: FC<KonvaWaveformVisualiserProps> = ({
  startTime,
  finishTime,
  currentPosition,
  audioDuration,
  pcm,
  onStartTimeChanged,
  onFinishTimeChanged,
}) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  const [tempStartTime, setTempStartTime] = useState(startTime)
  const [tempFinishTime, setTempFinishTime] = useState(finishTime)

  // Render dummy waveform if audioDuration or width is 0
  if (audioDuration === 0 || width === 0) {
    return (
      <div ref={ref} className="w-full border-2 border-gray-200">
        <Stage width={width} height={CANVAS_HEIGHT}></Stage>
      </div>
    )
  }

  const txStart = (tempStartTime / audioDuration) * width
  const txFinish = (tempFinishTime / audioDuration) * width

  const middleY = CANVAS_HEIGHT / 2
  const step = Math.ceil(pcm.length / width)
  const amp = CANVAS_HEIGHT / 2
  return (
    <div ref={ref} className="w-full border-2 border-gray-200">
      <Stage width={width} height={CANVAS_HEIGHT}>
        <Layer>
          {/* Inactive grey background */}
          <Rect width={width} height={CANVAS_HEIGHT} fill="#f0f0f0" />

          {/* Active background color between startTime and finishTime */}
          <Rect x={txStart} y={0} width={txFinish - txStart} height={CANVAS_HEIGHT} fill="#fff" />

          {/* Draw horizontal line at 0 amplitude */}
          <Line points={[0, middleY, width, middleY]} stroke="#000" strokeWidth={1} />

          {/* Draw waveform */}
          <Shape
            sceneFunc={(context) => {
              context.beginPath()
              context.lineWidth = 1
              context.strokeStyle = '#3b82f6'
              for (let i = 0; i < width; i++) {
                let min = 1.0
                let max = -1.0
                for (let j = 0; j < step; j++) {
                  const datum = pcm[i * step + j]
                  if (datum < min) min = datum
                  if (datum > max) max = datum
                }
                context.moveTo(i, (1 + min) * amp)
                context.lineTo(i, (1 + max) * amp)
              }
              context.stroke()
            }}
          />

          {/* Current position line */}
          <Line
            points={[
              (currentPosition / audioDuration) * width,
              0,
              (currentPosition / audioDuration) * width,
              CANVAS_HEIGHT,
            ]}
            stroke="#ff0000"
            strokeWidth={2}
          />

          {/* Start line and handles */}
          <DraggableTimeBoundary
            onTimeChanged={onStartTimeChanged}
            onTimeChangedTemporarily={setTempStartTime}
            time={startTime}
            audioDuration={audioDuration}
            width={Pixels(width)}
          />

          {/* Finish line and handles */}
          <DraggableTimeBoundary
            onTimeChanged={onFinishTimeChanged}
            onTimeChangedTemporarily={setTempFinishTime}
            time={finishTime}
            audioDuration={audioDuration}
            width={Pixels(width)}
          />
        </Layer>
      </Stage>
    </div>
  )
}
