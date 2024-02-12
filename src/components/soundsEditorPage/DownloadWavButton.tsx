import Icon from '@mdi/react'
import { EditSoundPaneTestIds } from './EditSoundPaneTestIds.ts'
import { mdiDownload } from '@mdi/js'
import { Button } from 'react-aria-components'
import { getDisplayName, Sound, SoundAudio } from '../../types/Sound.ts'
import { AudioBufferUtils } from '../../audioRecorder/AudioBufferUtils.ts'
import { useAudioContext } from '../../audioRecorder/AudioContextProvider.ts'
import { useDownloadFile } from 'react-downloadfile-hook'
import { useMemo } from 'react'
import { Pcm, Seconds } from '../../utils/types/brandedTypes.ts'

interface DownloadWavButtonProps {
  sound: Sound
  audio: SoundAudio
}

const DEFAULT_SAMPLE_RATE = 48000

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
    return audioBufferUtils.pcmToWavArrayBuffer(croppedPcm)
  }, [audio.finishTime, audio.pcm, audio.startTime, audioContext])
  const { downloadFile } = useDownloadFile({
    fileName: `${getDisplayName(sound)}.wav`,
    format: 'audio/wav',
    data: arrayBuffer,
  })
  return (
    <Button
      data-testid={EditSoundPaneTestIds.downloadWavButton}
      className="flex items-center justify-center rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 active:bg-blue-800"
      onPress={downloadFile}
    >
      <Icon className="mr-2 h-4 w-4" path={mdiDownload} size={1} />
      Download WAV
    </Button>
  )
}
