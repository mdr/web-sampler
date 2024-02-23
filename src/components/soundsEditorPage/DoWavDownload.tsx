import { getDisplayName, SoundWithDefiniteAudio } from '../../types/Sound.ts'
import { getCroppedPcm } from '../../types/SoundAudio.ts'
import { AudioBufferUtils } from '../../audioRecorder/AudioBufferUtils.ts'
import { useAudioContext } from '../../audioRecorder/AudioContextProvider.ts'
import { useDownloadFile } from 'react-downloadfile-hook'
import { useMount } from 'react-use'

interface DoWavDownloadProps {
  sound: SoundWithDefiniteAudio

  onDownloaded(): void
}

export const DoWavDownload = ({ sound, onDownloaded }: DoWavDownloadProps) => {
  const audioContext = useAudioContext()
  const audioBufferUtils = new AudioBufferUtils(audioContext)
  const arrayBuffer = audioBufferUtils.pcmToWavArrayBuffer(getCroppedPcm(sound.audio))
  const { downloadFile } = useDownloadFile({
    fileName: `${getDisplayName(sound)}.wav`,
    format: 'audio/wav',
    data: arrayBuffer,
  })
  useMount(() => {
    downloadFile()
    onDownloaded()
  })
  return <></>
}
