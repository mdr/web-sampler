import { BlobReader, BlobWriter, Entry, TextWriter, WritableWriter, Writer, ZipReader } from '@zip.js/zip.js'

import { Sound, SoundId } from '../../../types/Sound.ts'
import { SoundAudio } from '../../../types/SoundAudio.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Pcm } from '../../../utils/types/brandedTypes.ts'
import { ExportedSound, ExportedSoundAudio, ExportedSoundLibrary } from './ExportedSoundLibrary.ts'
import { VERSION_NUMBER } from './exportSounds.ts'
import { SOUNDS_JSON_FILE_NAME } from './importExportConstants.ts'

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

const asSoundAudio = (exportedSoundAudio: ExportedSoundAudio, pcm: Pcm): SoundAudio => ({
  pcm,
  sampleRate: exportedSoundAudio.sampleRate,
  start: exportedSoundAudio.startTime,
  finish: exportedSoundAudio.finishTime,
  volume: exportedSoundAudio.volume,
})

const getData = <Type>(entry: Entry, writer: Writer<Type> | WritableWriter): Promise<Type> => {
  if (entry.getData === undefined) {
    throw new Error('getData is not defined on the entry')
  }
  return entry.getData(writer)
}

const buildSoundIdToPcmMap = async (entries: Entry[]): Promise<Map<SoundId, Pcm>> => {
  const soundIdToPcmMap = new Map<SoundId, Pcm>()
  for (const entry of entries) {
    if (entry.filename === SOUNDS_JSON_FILE_NAME) {
      continue
    }
    if (!entry.filename.endsWith('.pcm')) {
      throw new Error(`Unexpected file in zip: ${entry.filename}`)
    }
    const soundId = SoundId(entry.filename.replace('.pcm', ''))

    const pcmBlob = await getData(entry, new BlobWriter())
    const pcm = await pcmFromBlob(pcmBlob)
    soundIdToPcmMap.set(soundId, pcm)
  }
  return soundIdToPcmMap
}

const reconstructSound =
  (soundIdToPcmMap: Map<SoundId, Pcm>) =>
  (exportedSound: ExportedSound): Sound => {
    const soundId = exportedSound.id
    const pcm = soundIdToPcmMap.get(soundId)
    let audio: Option<SoundAudio>
    if (exportedSound.audio !== undefined) {
      if (pcm === undefined) {
        throw new Error(`No PCM found for sound ${soundId}`)
      }
      audio = asSoundAudio(exportedSound.audio, pcm)
    }
    return { id: soundId, name: exportedSound.name, audio }
  }

const getExportedSoundsLibrary = async (entries: Entry[]): Promise<ExportedSoundLibrary> => {
  const soundsEntry = entries.find((entry) => entry.filename === SOUNDS_JSON_FILE_NAME)
  if (soundsEntry === undefined) {
    throw new Error(`${SOUNDS_JSON_FILE_NAME} not found in zip file`)
  }
  const jsonString = await getData(soundsEntry, new TextWriter())
  const json = JSON.parse(jsonString) as { version: number }
  if (json.version !== VERSION_NUMBER) {
    throw new Error(`Unexpected version: ${json.version}`)
  }
  return ExportedSoundLibrary.parse(json)
}

const reconstructSounds = async (entries: Entry[]): Promise<Sound[]> => {
  const exportedSoundsLibrary = await getExportedSoundsLibrary(entries)

  const soundIdToPcmMap = await buildSoundIdToPcmMap(entries)

  return exportedSoundsLibrary.sounds.map(reconstructSound(soundIdToPcmMap))
}

export const unzipSounds = async (blob: Blob): Promise<Sound[]> => {
  const zipReader = new ZipReader(new BlobReader(blob))
  try {
    const entries = await zipReader.getEntries()
    return await reconstructSounds(entries)
  } finally {
    await zipReader.close()
  }
}
