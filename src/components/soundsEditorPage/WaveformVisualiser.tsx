import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Seconds } from '../../utils/types/brandedTypes.ts'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { SoundAudio } from '../../types/Sound.ts'
import clsx from 'clsx'

interface WaveformVisualiserProps {
  audio: SoundAudio
  currentPosition: Seconds
  audioDuration: Seconds
  onPositionChange: (position: Seconds) => void
  onStartTimeChange: (startTime: Seconds) => void
  onFinishTimeChange: (finishTime: Seconds) => void
}

const getCanvasRenderingContext2D = (canvas: HTMLCanvasElement): CanvasRenderingContext2D => {
  const ctx = canvas.getContext('2d') ?? undefined
  if (ctx === undefined) {
    throw new Error('Canvas rendering context is null')
  }
  return ctx
}

const START_FINISH_TIME_INTERACTION_TOLERANCE_PIXELS = 5

export const WaveformVisualiser: React.FC<WaveformVisualiserProps> = ({
  audio,
  currentPosition,
  audioDuration,
  onPositionChange,
  onStartTimeChange,
  onFinishTimeChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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

    // Default grey background
    ctx.clearRect(0, 0, width, height)
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, width, height)

    const xStart = (startTime / audioDuration) * width
    const xFinish = (finishTime / audioDuration) * width

    // Active background color between startTime and finishTime
    ctx.fillStyle = '#fff'
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

    const HANDLE_RADIUS = 5

    // Start line
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.fillStyle = '#000000'

    // Top handle
    ctx.beginPath()
    ctx.arc(xStart, HANDLE_RADIUS, HANDLE_RADIUS, 0, 2 * Math.PI)
    ctx.fill()

    // Bottom handle
    ctx.beginPath()
    ctx.arc(xStart, height - HANDLE_RADIUS, HANDLE_RADIUS, 0, 2 * Math.PI)
    ctx.fill()

    // Vertical line
    ctx.beginPath()
    ctx.moveTo(xStart, 0)
    ctx.lineTo(xStart, height)
    ctx.stroke()

    // Finish line
    ctx.strokeStyle = '#000000'
    ctx.lineWidth = 2
    ctx.fillStyle = '#000000'

    // Top handle
    ctx.beginPath()
    ctx.arc(xFinish, HANDLE_RADIUS, HANDLE_RADIUS, 0, 2 * Math.PI)
    ctx.fill()

    // Bottom handle
    ctx.beginPath()
    ctx.arc(xFinish, height - HANDLE_RADIUS, HANDLE_RADIUS, 0, 2 * Math.PI)
    ctx.fill()

    // Vertical line
    ctx.beginPath()
    ctx.moveTo(xFinish, 0)
    ctx.lineTo(xFinish, height)
    ctx.stroke()

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

      if (Math.abs(x - xStart) < START_FINISH_TIME_INTERACTION_TOLERANCE_PIXELS) {
        setIsDraggingStart(true)
      } else if (Math.abs(x - xFinish) < START_FINISH_TIME_INTERACTION_TOLERANCE_PIXELS) {
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
          setStartTime(Seconds(Math.min(newTime, finishTime)))
        } else if (isDraggingFinish) {
          setFinishTime(Seconds(Math.max(newTime, startTime)))
        }
      } else {
        const xStart = (startTime / audioDuration) * canvas.width
        const xFinish = (finishTime / audioDuration) * canvas.width
        setIsHoveringStart(Math.abs(x - xStart) < START_FINISH_TIME_INTERACTION_TOLERANCE_PIXELS)
        setIsHoveringFinish(Math.abs(x - xFinish) < START_FINISH_TIME_INTERACTION_TOLERANCE_PIXELS)
      }
    },
    [isDraggingStart, isDraggingFinish, audioDuration, startTime, finishTime],
  )

  const handleMouseUp = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (isDraggingStart) {
        setIsDraggingStart(false)
        onStartTimeChange(startTime)
      } else if (isDraggingFinish) {
        setIsDraggingFinish(false)
        onFinishTimeChange(finishTime)
      } else {
        const canvas = canvasRef.current ?? undefined
        if (canvas === undefined) {
          return
        }
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const position = Seconds((x / canvas.width) * audioDuration)

        onPositionChange(position)
      }
    },
    [
      isDraggingStart,
      isDraggingFinish,
      onStartTimeChange,
      startTime,
      onFinishTimeChange,
      finishTime,
      audioDuration,
      onPositionChange,
    ],
  )

  useEffect(() => {
    drawWaveform()
  }, [drawWaveform])

  return (
    <canvas
      data-testid={EditSoundPaneTestIds.waveformCanvas}
      className={clsx('w-full border-2 border-gray-200', { 'cursor-grab': isHoveringStart || isHoveringFinish })}
      ref={canvasRef}
      height="400"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  )
}
