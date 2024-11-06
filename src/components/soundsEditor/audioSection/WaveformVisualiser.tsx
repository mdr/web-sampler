import Konva from 'konva'
import { memo, useCallback, useState } from 'react'
import { Layer, Line, Rect, Stage } from 'react-konva'
import { useMeasure } from 'react-use'

import { Option } from '../../../utils/types/Option.ts'
import { Pcm, Pixels, Seconds } from '../../../utils/types/brandedTypes.ts'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'
import { DraggableTimeBoundary } from './DraggableTimeBoundary.tsx'
import { Ticks } from './Ticks.tsx'
import { Waveform } from './Waveform.tsx'
import { CANVAS_HEIGHT } from './waveformConstants.ts'

import KonvaEventObject = Konva.KonvaEventObject

export interface WaveformVisualiserProps {
  readonly pcm: Pcm
  startTime: Seconds
  finishTime: Seconds
  currentPosition: Seconds
  audioDuration: Seconds

  onPositionChange: (position: Seconds) => void

  onStartTimeChanged(startTime: Seconds): void

  onFinishTimeChanged(finishTime: Seconds): void
}

export const WaveformVisualiser = memo(
  ({
    startTime,
    finishTime,
    currentPosition,
    audioDuration,
    pcm,
    onPositionChange,
    onStartTimeChanged,
    onFinishTimeChanged,
  }: WaveformVisualiserProps) => {
    const [ref, rect] = useMeasure<HTMLDivElement>()
    const width = Pixels(rect.width)
    // Used while dragging:
    const [tempStartX, setTempStartX] = useState<Option<Pixels>>(undefined)
    const [tempFinishX, setTempFinishX] = useState<Option<Pixels>>(undefined)

    const toSeconds = useCallback((x: Pixels): Seconds => Seconds((x / width) * audioDuration), [audioDuration, width])
    const toPixels = useCallback(
      (seconds: Seconds): Pixels => Pixels((seconds / audioDuration) * width),
      [audioDuration, width],
    )

    const handleClick = (e: KonvaEventObject<MouseEvent>) => {
      const stage = e.target.getStage() ?? undefined
      const pointerPosition = stage?.getPointerPosition() ?? undefined
      if (!pointerPosition) return
      const x = Pixels(pointerPosition.x)
      const newPosition = toSeconds(x)
      onPositionChange(newPosition)
    }

    const handleStartPositionChanged = (x: Pixels) => onStartTimeChanged(toSeconds(x))
    const handleStartPositionChangedTemporarily = (x: Option<Pixels>) => setTempStartX(x)
    const handleFinishTimeChanged = (x: Pixels) => onFinishTimeChanged(toSeconds(x))
    const handleFinishTimeChangedTemporarily = (x: Option<Pixels>) => setTempFinishX(x)

    const xStart = toPixels(startTime)
    const xFinish = toPixels(finishTime)

    const activeXStart = tempStartX ?? xStart
    const activeXFinish = tempFinishX ?? xFinish
    const activeWidth = activeXFinish - activeXStart

    return (
      <div ref={ref} className="w-full border-2 border-gray-200" data-testid={EditSoundPaneTestIds.waveformCanvas}>
        <Stage width={width} height={CANVAS_HEIGHT} onClick={handleClick}>
          {audioDuration > 0 && width > 0 && (
            <Layer>
              {/* Active / inactive background */}
              <Rect width={width} height={CANVAS_HEIGHT} fill="#f0f0f0" />
              <Rect x={activeXStart} y={0} width={activeWidth} height={CANVAS_HEIGHT} fill="#fff" />

              {/* Horizontal line at 0 amplitude */}
              <Line points={[0, CANVAS_HEIGHT / 2, width, CANVAS_HEIGHT / 2]} stroke="#000" strokeWidth={1} />

              <Ticks
                audioDuration={audioDuration}
                includeMillisecondTicks={width > 600}
                includeSecondLabels={width > 300}
                toPixels={toPixels}
              />

              <Waveform pcm={pcm} width={width} />

              {/* Current position line */}
              <Line
                points={[toPixels(currentPosition), 0, toPixels(currentPosition), CANVAS_HEIGHT]}
                stroke="#ff0000"
                strokeWidth={2}
              />

              {/* Start line */}
              <DraggableTimeBoundary
                onPositionChanged={handleStartPositionChanged}
                onPositionChangedTemporarily={handleStartPositionChangedTemporarily}
                x={xStart}
                xMax={width}
                dragMin={Pixels(0)}
                dragMax={xFinish}
              />

              {/* Finish line */}
              {xStart !== width && ( // Don't show finish line if start line is at the end to allow the start line to still be dragged
                <DraggableTimeBoundary
                  onPositionChanged={handleFinishTimeChanged}
                  onPositionChangedTemporarily={handleFinishTimeChangedTemporarily}
                  x={xFinish}
                  xMax={width}
                  dragMin={xStart}
                  dragMax={width}
                />
              )}
            </Layer>
          )}
        </Stage>
      </div>
    )
  },
)

WaveformVisualiser.displayName = 'WaveformVisualiser'
