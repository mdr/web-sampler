import { useCallback, useEffect, useState } from 'react'
import { useAudioRecorder } from './AudioRecorderContext.ts'

export enum AudioRecorderState {
  IDLE = 'IDLE',
  RECORDING = 'RECORDING',
}

export enum StartRecordingOutcome {
  SUCCESS = 'SUCCESS',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  NO_AUDIO_TRACK = 'NO_AUDIO_TRACK',
}

export type AudioRecorderStateChangeListener = (state: AudioRecorderState) => void

export type RecordingCompleteListener = (audioBuffer: AudioBuffer, audioBlob: Blob) => void

export interface IAudioRecorder {
  addStateChangeListener(listener: AudioRecorderStateChangeListener): void

  removeStateChangeListener(listener: AudioRecorderStateChangeListener): void

  addRecordingCompleteListener(listener: RecordingCompleteListener): void

  removeRecordingCompleteListener(listener: RecordingCompleteListener): void

  startRecording(): Promise<StartRecordingOutcome>

  stopRecording(): void

  readonly state: AudioRecorderState

  readonly volume: number
}

export const useAudioRecorderState = () => {
  const audioRecorder = useAudioRecorder()
  const [state, setState] = useState<AudioRecorderState>(audioRecorder.state)
  const handleStateChanged = useCallback((newState: AudioRecorderState) => setState(newState), [setState])
  useEffect(() => {
    audioRecorder.addStateChangeListener(handleStateChanged)
    return () => audioRecorder.removeStateChangeListener(handleStateChanged)
  })
  return state
}
