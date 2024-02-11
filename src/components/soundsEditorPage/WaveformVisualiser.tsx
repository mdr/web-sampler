import React, { useCallback, useEffect, useRef } from 'react'
import { Seconds } from '../../utils/types/brandedTypes.ts'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { SoundAudio } from '../../types/Sound.ts'

interface WaveformVisualiserProps {
  audio: SoundAudio
  currentPosition: Seconds
  audioDuration: Seconds
  onPositionChange: (position: Seconds) => void
}

const getCanvasRenderingContext2D = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
  const ctx = canvas.getContext('2d') ?? undefined
  if (ctx === undefined) {
    throw new Error('Canvas rendering context is null')
  }
  return ctx
}

export const WaveformVisualiser: React.FC<WaveformVisualiserProps> = ({
  audio,
  currentPosition,
  audioDuration,
  onPositionChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pcm = audio.pcm
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current ?? undefined
    if (canvas === undefined) {
      return
    }
    const ctx = getCanvasRenderingContext2D(canvas)

    const width = canvas.width
    const height = canvas.height
    const step = Math.ceil(pcm.length / width)
    const amp = height / 2

    // Clear canvas
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)

    // Draw horizontal line at 0 amplitude
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, amp)
    ctx.lineTo(width, amp)
    ctx.stroke()

    // Draw waveform
    ctx.lineWidth = 1
    ctx.strokeStyle = '#3b82f6'
    ctx.beginPath()

    for (let i = 0; i < width; i++) {
      let min = 1.0
      let max = -1.0
      for (let j = 0; j < step; j++) {
        const datum = pcm[i * step + j]
        if (datum < min) min = datum
        if (datum > max) max = datum
      }
      ctx.moveTo(i, (1 + min) * amp)
      ctx.lineTo(i, (1 + max) * amp)
    }

    ctx.stroke()

    // Draw current position line
    if (audioDuration > 0) {
      const x = (currentPosition / audioDuration) * width
      ctx.strokeStyle = '#ff0000'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
  }, [audio, currentPosition, audioDuration])

  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current ?? undefined
      if (canvas === undefined) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const position = Seconds((x / canvas.width) * audioDuration)

      onPositionChange(position)
    },
    [audioDuration, onPositionChange],
  )

  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  return (
    <canvas
      data-testid={EditSoundPaneTestIds.waveformCanvas}
      className="border-2 border-gray-200"
      ref={canvasRef}
      width="600"
      height="200"
      onClick={handleCanvasClick}
    />
  )
}
