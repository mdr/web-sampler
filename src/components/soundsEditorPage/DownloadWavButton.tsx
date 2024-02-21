import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { mdiDownload } from '@mdi/js'
import { DEFAULT_SAMPLE_RATE, getDisplayName, Sound, SoundAudio } from '../../types/Sound.ts'
import { AudioBufferUtils } from '../../audioRecorder/AudioBufferUtils.ts'
import { useAudioContext } from '../../audioRecorder/AudioContextProvider.ts'
import { useDownloadFile } from 'react-downloadfile-hook'
import { useMemo } from 'react'
import { Pcm, Seconds } from '../../utils/types/brandedTypes.ts'
import { Button } from '../shared/Button.tsx'

interface DownloadWavButtonProps {
  sound: Sound
  audio: SoundAudio
}

const cropPcm = (pcm: Pcm, start: Seconds, finish: Seconds): Pcm => {
  const startSample = Math.floor(start * DEFAULT_SAMPLE_RATE)
  const finishSample = Math.floor(finish * DEFAULT_SAMPLE_RATE)
  return Pcm(pcm.slice(startSample, finishSample))
}

export const DownloadWavButton = ({ sound, audio }: DownloadWavButtonProps) => {
  const audioContext = useAudioContext()
  const arrayBuffer = useMemo(() => {
    const audioBufferUtils = new AudioBufferUtils(audioContext)
    const croppedPcm = cropPcm(audio.pcm, audio.startTime, audio.finishTime)
    if (croppedPcm.length === 0) return new ArrayBuffer(0)
    return audioBufferUtils.pcmToWavArrayBuffer(croppedPcm)
  }, [audio.finishTime, audio.pcm, audio.startTime, audioContext])
  const { downloadFile } = useDownloadFile({
    fileName: `${getDisplayName(sound)}.wav`,
    format: 'audio/wav',
    data: arrayBuffer,
  })
  return (
    <Button
      testId={EditSoundPaneTestIds.downloadWavButton}
      icon={mdiDownload}
      label="Download WAV"
      onPress={downloadFile}
    />
  )
}
