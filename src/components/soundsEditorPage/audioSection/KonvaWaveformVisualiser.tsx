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

  const handleStartDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const xOffset = e.target.x()
      const secondsOffset = (xOffset / width) * audioDuration
      setTempStartTime(Seconds(startTime + secondsOffset))
    },
    [audioDuration, startTime, width],
  )

  const handleStartDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const xOffset = e.target.x()
      const secondsOffset = (xOffset / width) * audioDuration
      const newStartTime = Seconds(startTime + secondsOffset)
      e.target.position({ x: 0, y: 0 }) // Resets the drag translation
      onStartTimeChanged(newStartTime)
    },
    [audioDuration, onStartTimeChanged, startTime, width],
  )

  const handleFinishDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const xOffset = e.target.x()
      const secondsOffset = (xOffset / width) * audioDuration
      setTempFinishTime(Seconds(finishTime + secondsOffset))
    },
    [audioDuration, finishTime, width],
  )

  const handleFinishDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const xOffset = e.target.x()
      const secondsOffset = (xOffset / width) * audioDuration
      const newFinishTime = Seconds(finishTime + secondsOffset)
      e.target.position({ x: 0, y: 0 }) // Resets the drag translation
      onFinishTimeChanged(newFinishTime)
    },
    [audioDuration, finishTime, onFinishTimeChanged, width],
  )

  // Render dummy waveform if audioDuration or width is 0
  if (audioDuration === 0 || width === 0) {
    return (
      <div ref={ref} className="w-full border-2 border-gray-200">
        <Stage width={width} height={CANVAS_HEIGHT}></Stage>
      </div>
    )
  }

  const xStart = (startTime / audioDuration) * width
  const xFinish = (finishTime / audioDuration) * width

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
            onDragMove={handleStartDragMove}
            onDragEnd={handleStartDragEnd}
            dragBoundFunc={({ x }) => ({ x, y: 0 })}
          >
            <Circle x={xStart} y={HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
            <Circle x={xStart} y={CANVAS_HEIGHT - HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
            <Line points={[xStart, 0, xStart, CANVAS_HEIGHT]} stroke="#000000" strokeWidth={2} />
          </Group>

          {/* Finish line and handles */}
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
            onDragMove={handleFinishDragMove}
            onDragEnd={handleFinishDragEnd}
            dragBoundFunc={({ x }) => ({ x, y: 0 })}
          >
            <Circle x={xFinish} y={HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
            <Circle x={xFinish} y={CANVAS_HEIGHT - HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
            <Line points={[xFinish, 0, xFinish, CANVAS_HEIGHT]} stroke="#000000" strokeWidth={2} />
          </Group>
        </Layer>
      </Stage>
    </div>
  )
}
