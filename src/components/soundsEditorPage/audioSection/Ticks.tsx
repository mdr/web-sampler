import { CANVAS_HEIGHT } from './waveformConstants.ts'
import { Pixels, Seconds } from '../../../utils/types/brandedTypes.ts'
import { Line, Text } from 'react-konva'

const TICK_LABEL_TEXT_OFFSET = Pixels(15) // Offset above the major tick to place the text
const MAJOR_TICK_HEIGHT = Pixels(10)
const MINOR_TICK_HEIGHT = Pixels(5)

export interface TickProps {
  audioDuration: Seconds

  toPixels(seconds: Seconds): number
}

export const Ticks = ({ audioDuration, toPixels }: TickProps) => {
  const majorTicks = []
  const minorTicks = []

  const tickStartY = CANVAS_HEIGHT

  // Major ticks every second
  for (let i = 0; i <= audioDuration; i++) {
    const x = toPixels(Seconds(i))
    majorTicks.push(
      <Line
        key={`major-${i}`}
        points={[x, tickStartY - MAJOR_TICK_HEIGHT, x, tickStartY]}
        stroke="#000"
        strokeWidth={1}
      />,
      <Text
        key={`major-label-${i}`}
        x={x - (i >= 10 ? 7 : 3.2)}
        y={tickStartY - MAJOR_TICK_HEIGHT - TICK_LABEL_TEXT_OFFSET}
        text={`${i}`}
        fontSize={12}
        fill="#000"
      />,
    )
  }

  // Minor ticks every 0.1 seconds
  for (let i = 0; i <= audioDuration * 10; i++) {
    const x = toPixels(Seconds(i / 10))
    // Avoid placing a minor tick where a major tick exists
    if (i % 10 !== 0) {
      minorTicks.push(
        <Line
          key={`minor-${i}`}
          points={[x, tickStartY - MINOR_TICK_HEIGHT, x, tickStartY]}
          stroke="#000"
          strokeWidth={1}
        />,
      )
    }
  }

  return [...majorTicks, ...minorTicks]
}
