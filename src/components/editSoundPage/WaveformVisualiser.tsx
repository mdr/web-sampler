import React, { useCallback, useEffect, useRef } from 'react'

interface WaveformVisualiserProps {
  audio: Float32Array
}

export const WaveformVisualiser: React.FC<WaveformVisualiserProps> = ({ audio }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current ?? undefined
    if (!canvas) return
    const ctx = canvas.getContext('2d') ?? undefined
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const step = Math.ceil(audio.length / width)
    const amp = height / 2

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, width, height)
    ctx.lineWidth = 1
    ctx.strokeStyle = '#3b82f6'
    ctx.beginPath()

    for (let i = 0; i < width; i++) {
      let min = 1.0
      let max = -1.0
      for (let j = 0; j < step; j++) {
        const datum = audio[i * step + j]
        if (datum < min) min = datum
        if (datum > max) max = datum
      }
      ctx.moveTo(i, (1 + min) * amp)
      ctx.lineTo(i, (1 + max) * amp)
    }

    ctx.stroke()
  }, [audio])

  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  return <canvas className="border-2 border-gray-200" ref={canvasRef} width="600" height="200" />
}
