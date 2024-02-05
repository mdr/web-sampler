import { useCallback, useContext, useEffect, useState } from 'react'
import { useRequestAnimationFrame } from '../utils/hooks/useRequestAnimationFrame.ts'
import { AudioRecorder, AudioRecorderState, RecordingCompleteListener, StartRecordingOutcome } from './AudioRecorder.ts'
import { AudioRecorderContext } from './AudioRecorderContext.ts'

const useAudioRecorder = (): AudioRecorder => {
  const audioRecorder = useContext(AudioRecorderContext)
  if (audioRecorder === undefined) {
    throw new Error('no AudioRecorder available in context')
  }
  return audioRecorder
}

export const useAudioRecorderState = (): AudioRecorderState => {
  const audioRecorder = useAudioRecorder()
  const [state, setState] = useState<AudioRecorderState>(audioRecorder.state)
  const handleStateChanged = useCallback((newState: AudioRecorderState) => setState(newState), [setState])
  useEffect(() => {
    audioRecorder.addStateChangeListener(handleStateChanged)
    return () => audioRecorder.removeStateChangeListener(handleStateChanged)
  }, [audioRecorder, handleStateChanged])
  return state
}

export const useAudioRecorderVolume = (): number => {
  const audioRecorder = useAudioRecorder()
  const [volume, setVolume] = useState<number>(audioRecorder.volume)
  const handleAnimationFrame = useCallback(() => setVolume(audioRecorder.volume), [setVolume, audioRecorder])
  useRequestAnimationFrame(handleAnimationFrame)
  return volume
}

export const useAudioRecordingComplete = (onRecordingComplete: RecordingCompleteListener): void => {
  const audioRecorder = useAudioRecorder()
  useEffect(() => {
    audioRecorder.addRecordingCompleteListener(onRecordingComplete)
    return () => audioRecorder.removeRecordingCompleteListener(onRecordingComplete)
  }, [audioRecorder, onRecordingComplete])
}

export interface AudioRecorderActions {
  startRecording(): Promise<StartRecordingOutcome>

  stopRecording(): void
}

export const useAudioRecorderActions = (): AudioRecorderActions => useAudioRecorder()
