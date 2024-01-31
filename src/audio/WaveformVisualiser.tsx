import React, { useCallback, useEffect, useRef } from 'react'

interface WaveformVisualiserProps {
  audioBuffer: AudioBuffer
}

export const WaveformVisualiser: React.FC<WaveformVisualiserProps> = ({ audioBuffer }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const channelData = audioBuffer.getChannelData(0) // Assuming mono audio
    const bufferLength = audioBuffer.length
    const step = Math.ceil(bufferLength / width)
    const amp = height / 2

    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)
    ctx.lineWidth = 1
    ctx.strokeStyle = '#FFF'
    ctx.beginPath()

    for (let i = 0; i < width; i++) {
      let min = 1.0
      let max = -1.0
      for (let j = 0; j < step; j++) {
        const datum = channelData[i * step + j]
        if (datum < min) min = datum
        if (datum > max) max = datum
      }
      ctx.moveTo(i, (1 + min) * amp)
      ctx.lineTo(i, (1 + max) * amp)
    }

    ctx.stroke()
  }, [audioBuffer])

  useEffect(() => {
    drawWaveform()
  }, [audioBuffer, drawWaveform])

  return <canvas ref={canvasRef} width="600" height="200"></canvas>
}
