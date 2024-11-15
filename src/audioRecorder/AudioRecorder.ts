import { AudioData } from '../types/AudioData.ts'
import { Option } from '../utils/types/Option.ts'

export enum StartRecordingOutcome {
  SUCCESS = 'SUCCESS',
  CANCELLED_BY_USER = 'CANCELLED_BY_USER',
  NO_AUDIO_TRACK = 'NO_AUDIO_TRACK',
}

// audio is undefined if the recording was empty
export type RecordingCompleteListener = (audioData: Option<AudioData>) => void
