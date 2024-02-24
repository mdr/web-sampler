import { SoundAudio } from '../../../types/SoundAudio.ts'
import { ExportedSound, ExportedSoundAudio, ExportedSoundLibrary } from './ExportedSoundLibrary.tsx'
import { Pcm } from '../../../utils/types/brandedTypes.ts'
import { Sound } from '../../../types/Sound.ts'
import { BlobReader, BlobWriter, TextReader, ZipWriter } from '@zip.js/zip.js'
import { SOUNDS_JSON_FILE_NAME } from './importExportConstants.ts'

const exportSoundAudio = (audio: SoundAudio): ExportedSoundAudio => ({
  startTime: audio.startTime,
  finishTime: audio.finishTime,
})

const exportSound = (sound: Sound): ExportedSound => ({
  id: sound.id,
  name: sound.name,
  audio: sound.audio && exportSoundAudio(sound.audio),
})

const exportSounds = (sounds: readonly Sound[]): ExportedSoundLibrary => ({
  version: 1,
  sounds: sounds.map(exportSound),
})

const pcmToBlob = (pcm: Pcm): Blob => {
  const buffer = new ArrayBuffer(pcm.length * 4)
  const view = new DataView(buffer)
  for (let i = 0; i < pcm.length; i++) {
    view.setFloat32(i * 4, pcm[i], true)
  }
  return new Blob([buffer])
}

export const zipSounds = async (sounds: readonly Sound[]): Promise<Blob> => {
  const zipWriter = new ZipWriter(new BlobWriter())

  const metadata = exportSounds(sounds)
  const jsonText = JSON.stringify(metadata, null, 2)
  const soundsJsonReader = new TextReader(jsonText)
  await zipWriter.add(SOUNDS_JSON_FILE_NAME, soundsJsonReader)

  for (const sound of sounds) {
    if (sound.audio) {
      const blob = pcmToBlob(sound.audio.pcm)
      const pcmReader = new BlobReader(blob)
      await zipWriter.add(`${sound.id}.pcm`, pcmReader)
    }
  }

  return await zipWriter.close()
}
