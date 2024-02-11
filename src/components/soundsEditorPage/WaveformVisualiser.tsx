import React, { useCallback, useEffect, useRef, useState } from 'react'
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

const TOLERANCE = 5

export const WaveformVisualiser: React.FC<WaveformVisualiserProps> = ({
  audio,
  currentPosition,
  audioDuration,
  onPositionChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  // const { pcm, startTime, finishTime } = audio
  const { pcm } = audio
  const [startTime, setStartTime] = useState(audio.startTime)
  const [finishTime, setFinishTime] = useState(audio.finishTime)
  const [isDraggingStart, setIsDraggingStart] = useState(false)
  const [isDraggingFinish, setIsDraggingFinish] = useState(false)
  const [isHoveringStart, setIsHoveringStart] = useState(false)
  const [isHoveringFinish, setIsHoveringFinish] = useState(false)
  const [canvasDimensions, setCanvasDimensions] = useState([0, 0])

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

    // Calculate positions for startTime and finishTime
    const xStart = (startTime / audioDuration) * width
    const xFinish = (finishTime / audioDuration) * width

    // Draw background color between startTime and finishTime
    ctx.fillStyle = '#f0f0f0' // Light grey background
    ctx.fillRect(xStart, 0, xFinish - xStart, height)

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

    // Draw start line
    ctx.strokeStyle = '#00ff00'
    ctx.lineWidth = isHoveringStart ? 3 : 2
    ctx.beginPath()
    ctx.moveTo(xStart, 0)
    ctx.lineTo(xStart, height)
    ctx.stroke()

    // Draw finish line
    ctx.strokeStyle = '#0000ff'
    ctx.lineWidth = isHoveringFinish ? 3 : 2
    ctx.beginPath()
    ctx.moveTo(xFinish, 0)
    ctx.lineTo(xFinish, height)
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
    // eslint-disable-next-line
  }, [pcm, startTime, audioDuration, finishTime, isHoveringStart, isHoveringFinish, currentPosition, canvasDimensions])

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current ?? undefined
      if (canvas !== undefined) {
        canvas.width = canvas.offsetWidth
        setCanvasDimensions([canvas.offsetWidth, canvas.offsetHeight])
      }
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

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

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current ?? undefined
      if (canvas === undefined) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left

      const xStart = (startTime / audioDuration) * canvas.width
      const xFinish = (finishTime / audioDuration) * canvas.width

      if (Math.abs(x - xStart) < TOLERANCE) {
        setIsDraggingStart(true)
      } else if (Math.abs(x - xFinish) < TOLERANCE) {
        setIsDraggingFinish(true)
      }
    },
    [startTime, finishTime, audioDuration],
  )

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current ?? undefined
      if (canvas === undefined) {
        return
      }

      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left

      if (isDraggingStart || isDraggingFinish) {
        const newTime = Seconds((x / canvas.width) * audioDuration)

        if (isDraggingStart) {
          setStartTime(newTime)
        } else if (isDraggingFinish) {
          setFinishTime(newTime)
        }
      } else {
        const xStart = (startTime / audioDuration) * canvas.width
        const xFinish = (finishTime / audioDuration) * canvas.width
        setIsHoveringStart(Math.abs(x - xStart) < TOLERANCE)
        setIsHoveringFinish(Math.abs(x - xFinish) < TOLERANCE)
      }
    },
    [isDraggingStart, isDraggingFinish, audioDuration, startTime, finishTime],
  )

  const handleMouseUp = useCallback(() => {
    if (isDraggingStart) setIsDraggingStart(false)
    if (isDraggingFinish) setIsDraggingFinish(false)
  }, [isDraggingStart, isDraggingFinish])

  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  return (
    <canvas
      data-testid={EditSoundPaneTestIds.waveformCanvas}
      className="w-full border-2 border-gray-200"
      ref={canvasRef}
      height="400"
      onClick={handleCanvasClick}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  )
}
