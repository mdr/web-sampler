import { useCallback, useEffect, useState } from 'react'

import { useRequestAnimationFrame } from '../utils/hooks/useRequestAnimationFrame.ts'
import { createOptionalContext, useService, useServiceStateSelector } from '../utils/providerish/serviceHooks.ts'
import { Volume } from '../utils/types/brandedTypes.ts'
import { RecordingCompleteListener } from './AudioRecorder.ts'
import { AudioRecorderActions, AudioRecorderService, AudioRecorderState } from './AudioRecorderService.ts'

export const AudioRecorderServiceContext = createOptionalContext<AudioRecorderService>()

export const useAudioRecorderState = <Selected = AudioRecorderState>(
  selector: (state: AudioRecorderState) => Selected = (state) => state as Selected,
): Selected =>
  useServiceStateSelector<AudioRecorderState, AudioRecorderService, Selected>(AudioRecorderServiceContext, selector)

export const useAudioRecorderActions = (): AudioRecorderActions => useService(AudioRecorderServiceContext)

export const useAudioRecorderVolumeRaf = (): Volume => {
  const audioRecorder = useService(AudioRecorderServiceContext)
  const [volume, setVolume] = useState<Volume>(audioRecorder.volume)
  const handleAnimationFrame = useCallback(() => setVolume(audioRecorder.volume), [setVolume, audioRecorder])
  useRequestAnimationFrame(handleAnimationFrame)
  return volume
}

export const useAudioRecordingComplete = (onRecordingComplete: RecordingCompleteListener): void => {
  const audioRecorder = useService(AudioRecorderServiceContext)
  useEffect(() => {
    audioRecorder.addRecordingCompleteListener(onRecordingComplete)
    return () => audioRecorder.removeRecordingCompleteListener(onRecordingComplete)
  }, [audioRecorder, onRecordingComplete])
}
