import { Circle, Layer, Line, Rect, Shape, Stage } from 'react-konva'
import { Pcm, Pixels, Seconds } from '../../../utils/types/brandedTypes.ts'
import { FC } from 'react'
import { useMeasure } from 'react-use'
// import { useMeasure } from 'react-use'

const HANDLE_RADIUS = Pixels(5)

export interface KonvaWaveformVisualiserProps {
  readonly pcm: Pcm
  startTime: Seconds
  finishTime: Seconds
  currentPosition: Seconds
  audioDuration: Seconds
}

export const KonvaWaveformVisualiser: FC<KonvaWaveformVisualiserProps> = ({
  startTime,
  finishTime,
  currentPosition,
  audioDuration,
  pcm,
}) => {
  const [ref, { width }] = useMeasure<HTMLDivElement>()
  // console.log({ width })
  // const ref = useRef<HTMLDivElement>(null)
  // const [width, setWidth] = useState(0)
  // useEffect(() => {
  //   const onResize = () => {
  //     const div = ref.current ?? undefined
  //     if (div !== undefined) {
  //       setWidth(div.clientWidth)
  //     }
  //   }
  //   onResize()
  //   window.addEventListener('resize', onResize)
  //   return () => window.removeEventListener('resize', onResize)
  // }, [])

  const height = 300
  const xStart = (startTime / audioDuration) * width
  const xFinish = (finishTime / audioDuration) * width
  const middleY = height / 2
  const step = Math.ceil(pcm.length / width)
  const amp = height / 2
  return (
    <div ref={ref} className="w-full border-2 border-gray-200">
      <Stage width={width} height={height}>
        <Layer>
          {/* Inactive grey background */}
          <Rect width={width} height={height} fill="#f0f0f0" />

          {/* Active background color between startTime and finishTime */}
          <Rect x={xStart} y={0} width={xFinish - xStart} height={height} fill="#fff" />

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
          {audioDuration > 0 && (
            <Line
              points={[(currentPosition / audioDuration) * width, 0, (currentPosition / audioDuration) * width, height]}
              stroke="#ff0000"
              strokeWidth={2}
            />
          )}

          {/* Start line and handles */}
          <Circle x={xStart} y={HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
          <Circle x={xStart} y={height - HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
          <Line points={[xStart, 0, xStart, height]} stroke="#000000" strokeWidth={2} />

          {/* Finish line and handles */}
          <Circle x={xFinish} y={HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
          <Circle x={xFinish} y={height - HANDLE_RADIUS} radius={HANDLE_RADIUS} fill="#000000" />
          <Line points={[xFinish, 0, xFinish, height]} stroke="#000000" strokeWidth={2} />
        </Layer>
      </Stage>
    </div>
  )
}
