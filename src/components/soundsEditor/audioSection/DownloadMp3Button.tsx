import { mdiDownload } from '@mdi/js'
import { getSoundDisplayName, SoundWithDefiniteAudio } from '../../../types/Sound.ts'
import { Button } from '../../shared/Button.tsx'
import { getPlayRegionAudioData } from '../../../types/SoundAudio.ts'
import FileSaver from 'file-saver'
import { EditSoundPaneTestIds } from '../editSoundPane/EditSoundPaneTestIds.ts'
import { Mp3Encoder } from '@breezystack/lamejs'
import { AudioData } from '../../../types/AudioData.ts'

interface DownloadMp3ButtonProps {
  sound: SoundWithDefiniteAudio
}

const encodeMp3 = (audioData: AudioData): Blob => {
  const mp3Encoder = new Mp3Encoder(1, audioData.sampleRate, 128)
  const samples = new Int16Array(audioData.pcm.length)
  for (let i = 0; i < audioData.pcm.length; i++) {
    samples[i] = audioData.pcm[i] * 0x7fff
  }
  const sampleBlockSize = 1152 //can be anything but make it a multiple of 576 to make encoders life easier
  const mp3Data = []
  for (let i = 0; i < samples.length; i += sampleBlockSize) {
    const sampleChunk = samples.subarray(i, i + sampleBlockSize)
    const mp3buf = mp3Encoder.encodeBuffer(sampleChunk)
    if (mp3buf.length > 0) {
      mp3Data.push(mp3buf)
    }
  }
  const mp3buf = mp3Encoder.flush()
  if (mp3buf.length > 0) {
    mp3Data.push(new Int8Array(mp3buf))
  }
  return new Blob(mp3Data, { type: 'audio/mp3' })
}

export const DownloadMp3Button = ({ sound }: DownloadMp3ButtonProps) => {
  const doDownload = () => {
    const audioData = getPlayRegionAudioData(sound.audio)
    const mp3Blob = encodeMp3(audioData)
    FileSaver.saveAs(mp3Blob, `${getSoundDisplayName(sound)}.mp3`)
  }
  return (
    <Button
      testId={EditSoundPaneTestIds.downloadMp3Button}
      icon={mdiDownload}
      label="Download MP3"
      onPress={doDownload}
    />
  )
}
