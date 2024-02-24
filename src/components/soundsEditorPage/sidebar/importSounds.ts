import { BlobReader, BlobWriter, Entry, TextWriter, WritableWriter, Writer, ZipReader } from '@zip.js/zip.js'
import { SoundAudio } from '../../../types/SoundAudio.ts'
import { Sound, SoundId } from '../../../types/Sound.ts'
import { ExportedSoundAudio, ExportedSoundLibrary } from './ExportedSoundLibrary.tsx'
import { Pcm } from '../../../utils/types/brandedTypes.ts'

const pcmFromBlob = async (blob: Blob): Promise<Pcm> => {
  const arrayBuffer = await blob.arrayBuffer()
  const bufferLength = arrayBuffer.byteLength / 4
  const view = new DataView(arrayBuffer)
  const pcm = new Float32Array(bufferLength)
  for (let i = 0; i < bufferLength; i++) {
    pcm[i] = view.getFloat32(i * 4, true)
  }
  return Pcm(pcm)
}

const importSoundAudio = (exportedSoundAudio: ExportedSoundAudio, pcm: Pcm): SoundAudio => ({
  startTime: exportedSoundAudio.startTime,
  finishTime: exportedSoundAudio.finishTime,
  pcm,
})

const getData = async <Type>(entry: Entry, writer: Writer<Type> | WritableWriter): Promise<Type> => {
  const getData = entry.getData
  if (getData === undefined) {
    throw new Error('getData is undefined')
  }
  return getData(writer)
}

export const unzipSounds = async (blob: Blob): Promise<Sound[]> => {
  const zipReader = new ZipReader(new BlobReader(blob))
  const entries = await zipReader.getEntries()
  const sounds: Sound[] = []

  const soundsEntry = entries.find((entry) => entry.filename === 'sounds.json')
  if (soundsEntry === undefined) {
    throw new Error('sounds.json not found in zip file')
  }
  const textWriter = new TextWriter()
  const content = await getData(soundsEntry, textWriter)
  const exportedSoundsLibrary: ExportedSoundLibrary = JSON.parse(content as string)
  for (const entry of entries) {
    if (entry.filename === 'sounds.json') {
      continue
    }
    if (!entry.filename.endsWith('.pcm')) {
      throw new Error(`Unexpected file in zip: ${entry.filename}`)
    }
    const soundId = SoundId(entry.filename.replace('.pcm', ''))
    const exportedSound = exportedSoundsLibrary.sounds.find((s) => s.id === soundId)
    if (exportedSound === undefined) {
      throw new Error(`Sound ${soundId} not found in sounds.json`)
    }
    const blobWriter = new BlobWriter()
    const content = await getData(entry, blobWriter)
    const pcm = await pcmFromBlob(content)
    sounds.push({
      id: exportedSound.id,
      name: exportedSound.name,
      audio: exportedSound.audio ? importSoundAudio(exportedSound.audio, pcm) : undefined,
    })
  }
  await zipReader.close()
  return sounds
}
