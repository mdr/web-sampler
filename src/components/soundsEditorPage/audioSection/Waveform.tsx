import { Shape } from 'react-konva'
import { CANVAS_HEIGHT } from './waveformConstants.ts'
import { Pcm, Pixels } from '../../../utils/types/brandedTypes.ts'

export interface WaveformProps {
  pcm: Pcm
  width: Pixels
}

export const Waveform = ({ pcm, width }: WaveformProps) => (
  <Shape
    sceneFunc={(context) => {
      const samplesPerPixel = Math.floor(pcm.length / width)
      context.beginPath()
      context.lineWidth = 1
      context.strokeStyle = '#3b82f6'
      for (let x = 0; x < width; x++) {
        let min = 1.0
        let max = -1.0
        for (let sampleIndex = 0; sampleIndex < samplesPerPixel; sampleIndex++) {
          const datum = pcm[x * samplesPerPixel + sampleIndex]
          if (datum === undefined) break
          if (datum < min) min = datum
          if (datum > max) max = datum
        }
        context.moveTo(x, ((1 + min) / 2) * CANVAS_HEIGHT)
        context.lineTo(x, ((1 + max) / 2) * CANVAS_HEIGHT)
      }
      context.stroke()
    }}
  />
)
