import { useAudioRecorder } from './AudioRecorderContext.ts'
import { useCallback, useEffect, useState } from 'react'
import { useRequestAnimationFrame } from '../utils/hooks.ts'
import { AudioRecorderState } from './IAudioRecorder.ts'

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