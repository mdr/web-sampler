import { Layer, Line, Rect, Stage } from 'react-konva'
import { Pcm, Pixels, Seconds } from '../../../utils/types/brandedTypes.ts'
import { FC, useCallback, useState } from 'react'
import { useMeasure } from 'react-use'
import { DraggableTimeBoundary } from './DraggableTimeBoundary.tsx'
import { CANVAS_HEIGHT } from './waveformConstants.ts'
import Konva from 'konva'
import { Option } from '../../../utils/types/Option.ts'
import { EditSoundPaneTestIds } from '../EditSoundPaneTestIds.ts'
import { Waveform } from './Waveform.tsx'
import KonvaEventObject = Konva.KonvaEventObject

export interface WaveformProps {
  pcm: Pcm
  width: Pixels
}

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

export const WaveformVisualiser: FC<WaveformVisualiserProps> = ({
  startTime,
  finishTime,
  currentPosition,
  audioDuration,
  pcm,
  onPositionChange,
  onStartTimeChanged,
  onFinishTimeChanged,
}) => {
  const [ref, rect] = useMeasure<HTMLDivElement>()
  const width = Pixels(rect.width)
  // Used while dragging:
  const [tempStartTime, setTempStartTime] = useState<Option<Seconds>>(undefined)
  const [tempFinishTime, setTempFinishTime] = useState<Option<Seconds>>(undefined)

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

  const activeXStart = toPixels(tempStartTime ?? startTime)
  const activeXFinish = toPixels(tempFinishTime ?? finishTime)
  const activeWidth = activeXFinish - activeXStart
  const middleY = CANVAS_HEIGHT / 2
  return (
    <div ref={ref} className="w-full border-2 border-gray-200" data-testid={EditSoundPaneTestIds.waveformCanvas}>
      <Stage width={width} height={CANVAS_HEIGHT} onClick={handleClick}>
        {audioDuration > 0 && width > 0 && (
          <Layer>
            {/* Active / inactive background */}
            <Rect width={width} height={CANVAS_HEIGHT} fill="#f0f0f0" />
            <Rect x={activeXStart} y={0} width={activeWidth} height={CANVAS_HEIGHT} fill="#fff" />

            {/* Horizontal line at 0 amplitude */}
            <Line points={[0, middleY, width, middleY]} stroke="#000" strokeWidth={1} />

            <Waveform pcm={pcm} width={width} />

            {/* Current position line */}
            <Line
              points={[toPixels(currentPosition), 0, toPixels(currentPosition), CANVAS_HEIGHT]}
              stroke="#ff0000"
              strokeWidth={2}
            />

            {/* Start line */}
            <DraggableTimeBoundary
              onTimeChanged={onStartTimeChanged}
              onTimeChangedTemporarily={setTempStartTime}
              time={startTime}
              audioDuration={audioDuration}
              width={width}
              dragMin={Pixels(0)}
              dragMax={toPixels(finishTime)}
            />

            {/* Finish line */}
            <DraggableTimeBoundary
              onTimeChanged={onFinishTimeChanged}
              onTimeChangedTemporarily={setTempFinishTime}
              time={finishTime}
              audioDuration={audioDuration}
              width={width}
              dragMin={toPixels(startTime)}
              dragMax={width}
            />
          </Layer>
        )}
      </Stage>
    </div>
  )
}
