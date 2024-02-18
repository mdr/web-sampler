import { Circle, Group, Layer, Line, Rect, Shape, Stage } from 'react-konva'
import { Pcm, Pixels, Seconds } from '../../../utils/types/brandedTypes.ts'
import { FC, useCallback } from 'react'
import { useMeasure } from 'react-use'
import Konva from 'konva'
// import { useMeasure } from 'react-use'

const HANDLE_RADIUS = Pixels(5)

export interface KonvaWaveformVisualiserProps {
  readonly pcm: Pcm
  startTime: Seconds
  finishTime: Seconds
  currentPosition: Seconds
  audioDuration: Seconds

  onStartTimeChanged(startTime: Seconds): void
}

const HEIGHT = Pixels(300)

export const KonvaWaveformVisualiser: FC<KonvaWaveformVisualiserProps> = ({
  startTime,
  finishTime,
  currentPosition,
  audioDuration,
  pcm,
  onStartTimeChanged,
}) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>()

  const handleDragEnd = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const newX = e.target.x()
      const newDisplayStartTime = Seconds((newX / width) * audioDuration)
      onStartTimeChanged(newDisplayStartTime)
    },
    [audioDuration, onStartTimeChanged, width],
  )

  //Render dummy waveform if audioDuration or width is 0
  if (audioDuration === 0 || width === 0) {
    return (
      <div ref={ref} className="w-full border-2 border-gray-200">
        <Stage width={width} height={HEIGHT}></Stage>
      </div>
    )
  }

  const xStart = (startTime / audioDuration) * width
  const xFinish = (finishTime / audioDuration) * width
  const middleY = HEIGHT / 2
  const step = Math.ceil(pcm.length / width)
  const amp = HEIGHT / 2
  return (
    <div ref={ref} className="w-full border-2 border-gray-200">
      <Stage width={width} height={HEIGHT}>
        <Layer>
          {/* Inactive grey background */}
          <Rect width={width} height={HEIGHT} fill="#f0f0f0" />

          {/* Active background color between startTime and finishTime */}
          <Rect x={xStart} y={0} width={xFinish - xStart} height={HEIGHT} fill="#fff" />

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
            points={[(currentPosition / audioDuration) * width, 0, (currentPosition / audioDuration) * width, HEIGHT]}
            stroke="#ff0000"
            strokeWidth={2}
          />

          {/* Start line and handles */}
          <Group
            draggable
            onDragEnd={handleDragEnd}
            // Optional: Restrict dragging to horizontal movement
            dragBoundFunc={(pos) => ({ x: pos.x, y: 0 })}
          >
            <Circle x={xStart} y={HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
            <Circle x={xStart} y={HEIGHT - HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
            <Line points={[xStart, 0, xStart, HEIGHT]} stroke="#000000" strokeWidth={2} />
          </Group>

          {/* Finish line and handles */}
          <Circle x={xFinish} y={HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
          <Circle x={xFinish} y={HEIGHT - HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
          <Line points={[xFinish, 0, xFinish, HEIGHT]} stroke="#000000" strokeWidth={2} />
        </Layer>
      </Stage>
    </div>
  )
}
