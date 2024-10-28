import flushPromises from 'flush-promises'
import { describe, expect, it, test } from 'vitest'

import { SoundId, newSoundId } from '../../types/Sound.ts'
import { SoundAudio } from '../../types/SoundAudio.ts'
import { Soundboard } from '../../types/Soundboard.ts'
import { makeImage } from '../../types/image.testSupport.ts'
import { SoundTestConstants, makePcm, makeSound, makeSoundWithAudio } from '../../types/sound.testSupport.ts'
import { makeSoundboard, makeSoundboardTile } from '../../types/soundboard.testSupport.ts'
import { pcmSlice } from '../../utils/pcmUtils.ts'
import { Samples, Volume } from '../../utils/types/brandedTypes.ts'
import { MemorySoundStore } from '../store/MemorySoundStore.testSupport.ts'
import { makeLoadedSoundLibrary, setUpTest } from './SoundLibrary.testSupport.ts'
import { SoundLibrary } from './SoundLibrary.ts'

it('should load data from the store on creation', async () => {
  const sounds = [makeSound()]
  const soundBoards = [makeSoundboard()]
  const images = [makeImage()]
  const soundStore = new MemorySoundStore(sounds, soundBoards, images)
  const library = new SoundLibrary(soundStore)
  expect(library.isLoading).toBe(true)
  expect(library.sounds).toEqual([])
  expect(library.soundboards).toEqual([])
  expect(library.images).toEqual([])

  await flushPromises()

  expect(library.isLoading).toBe(false)
  expect(library.sounds).toIncludeSameMembers(sounds)
  expect(library.soundboards).toIncludeSameMembers(soundBoards)
  expect(library.images).toIncludeSameMembers(images)
})

it('should not allow sounds to be modified while still loading', () => {
  const sound = makeSound()
  const soundStore = new MemorySoundStore([sound])
  const library = new SoundLibrary(soundStore)
  expect(library.isLoading).toBe(true)

  expect(library.newSound).toThrowErrorMatchingInlineSnapshot(
    `[Error: Cannot manipulate sounds yet as they are still loading]`,
  )
  expect(() => library.deleteSound(sound.id)).toThrowErrorMatchingInlineSnapshot(
    `[Error: Cannot manipulate sounds yet as they are still loading]`,
  )
  expect(() => library.setSoundName(sound.id, SoundTestConstants.name)).toThrowError()
})

it('should allow sounds to be queried', async () => {
  const sound = makeSound()
  const library = await makeLoadedSoundLibrary(new MemorySoundStore([sound]))

  expect(library.findSound(sound.id)).toEqual(sound)
  expect(library.findSound(newSoundId())).toBeUndefined()
})

it('should allow a new sound to be added', async () => {
  const { library, soundStore, listener } = await setUpTest()

  const sound = library.newSound()

  expect(sound.name).toEqual('')
  expect(sound.audio).toBeUndefined()
  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.sounds).toEqual([sound])
  await flushPromises()
  expect(soundStore.sounds).toEqual([sound])
})

it('should support removing listeners', async () => {
  const sound = makeSound()
  const { library, listener } = await setUpTest({ sounds: [sound] })

  library.removeListener(listener)

  library.setSoundName(sound.id, SoundTestConstants.newName)
  expect(listener).not.toHaveBeenCalled()
})

describe('deleteSound', () => {
  it('should allow a sound to be deleted', async () => {
    const sound = makeSound()
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound] })

    library.deleteSound(sound.id)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.sounds).toEqual([])
    await flushPromises()
    expect(soundStore.sounds).toEqual([])
  })

  it('should remove a sound from any soundboard it is in when deleted', async () => {
    const sound1 = makeSound()
    const sound2 = makeSound()
    const tile1 = makeSoundboardTile({ soundId: sound1.id })
    const tile2 = makeSoundboardTile({ soundId: sound2.id })
    const soundboard = makeSoundboard({ tiles: [tile1, tile2] })
    const { library, soundStore } = await setUpTest({ sounds: [sound1, sound2], soundboards: [soundboard] })

    library.deleteSound(sound1.id)

    const expectedSoundboard: Soundboard = { ...soundboard, tiles: [tile2] }
    expect(library.soundboards).toEqual([expectedSoundboard])
    await flushPromises()
    expect(soundStore.soundboards).toEqual([expectedSoundboard])
  })
})

it('should allow a sound name to be changed', async () => {
  const sound = makeSound({ name: SoundTestConstants.oldName })
  const { library, soundStore, listener } = await setUpTest({ sounds: [sound] })

  library.setSoundName(sound.id, SoundTestConstants.newName)

  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.getSound(sound.id).name).toEqual(SoundTestConstants.newName)
  await flushPromises()
  expect(soundStore.getSound(sound.id).name).toEqual(SoundTestConstants.newName)
})

describe('importSounds', () => {
  it('should allow sounds to be imported', async () => {
    const oldSounds = [makeSound()]
    const { library, soundStore, listener } = await setUpTest({ sounds: oldSounds })
    const newSounds = [makeSound()]

    library.importSounds(newSounds)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.sounds).toEqual(newSounds)
    await flushPromises()
    expect(soundStore.sounds).toEqual(newSounds)
  })

  it('should clear soundboards when importing sounds', async () => {
    const sound = makeSound()
    const tile = makeSoundboardTile({ soundId: sound.id })
    const soundboard = makeSoundboard({ tiles: [tile] })
    const { library } = await setUpTest({ sounds: [sound], soundboards: [soundboard] })
    const newSounds = [makeSound()]

    library.importSounds(newSounds)

    expect(library.soundboards).toEqual([])
  })
})

it('should allow the volume of a sound to be set', async () => {
  const sound = makeSoundWithAudio({ volume: Volume(1) })
  const { library, soundStore, listener } = await setUpTest({ sounds: [sound] })

  library.setVolume(sound.id, Volume(0.5))

  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.getSound(sound.id).audio?.volume).toEqual(Volume(0.5))
  await flushPromises()
  expect(soundStore.getSound(sound.id).audio?.volume).toEqual(Volume(0.5))
})

it('should allow the audio of a sound to be cropped', async () => {
  const pcm = makePcm(Samples(100))
  const sound = makeSoundWithAudio({ pcm, start: Samples(10), finish: Samples(90) })
  const { library, soundStore, listener } = await setUpTest({ sounds: [sound] })

  library.cropAudio(sound.id)

  expect(listener).toHaveBeenCalledTimes(1)
  const expectedSoundAudio = {
    pcm: pcmSlice(pcm, Samples(10), Samples(90)),
    start: Samples(0),
    finish: Samples(80),
  } satisfies Partial<SoundAudio>
  expect(library.getSound(sound.id).audio).toMatchObject(expectedSoundAudio)
  await flushPromises()
  expect(soundStore.getSound(sound.id).audio).toMatchObject(expectedSoundAudio)
})

it('should allow a sound start time to be updated', async () => {
  const sound = makeSoundWithAudio({ start: Samples(10), finish: Samples(20) })
  const { library, listener } = await setUpTest({ sounds: [sound] })

  library.setAudioStart(sound.id, Samples(15))

  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.getSound(sound.id).audio?.start).toEqual(Samples(15))
  await flushPromises()
  expect(library.getSound(sound.id).audio?.start).toEqual(Samples(15))
})

it('should allow a sound finish time to be updated', async () => {
  const sound = makeSoundWithAudio({ start: Samples(10), finish: Samples(20) })
  const { library, listener } = await setUpTest({ sounds: [sound] })

  library.setAudioFinish(sound.id, Samples(15))

  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.getSound(sound.id).audio?.finish).toEqual(Samples(15))
  await flushPromises()
  expect(library.getSound(sound.id).audio?.finish).toEqual(Samples(15))
})

it('should allow a sound to be duplicated', async () => {
  const sound = makeSound()
  const { library, soundStore, listener } = await setUpTest({ sounds: [sound] })

  library.duplicateSound(sound.id)

  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.sounds).toIncludeSameMembers([sound, { ...sound, id: expect.anything() as SoundId }])
  await flushPromises()
  expect(soundStore.sounds).toIncludeSameMembers([sound, { ...sound, id: expect.anything() as SoundId }])
})

it('should allow audio data to be set', async () => {
  const sound = makeSound()
  const audioData = { pcm: makePcm(Samples(100)), sampleRate: SoundTestConstants.sampleRate }
  const { library, soundStore, listener } = await setUpTest({ sounds: [sound] })

  library.setAudioData(sound.id, audioData)

  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.getSound(sound.id).audio).toMatchObject(audioData)
  await flushPromises()
  expect(soundStore.getSound(sound.id).audio).toMatchObject(audioData)
})

describe('undo/redo', () => {
  it('should support undo and redo', async () => {
    const sound = makeSound({ name: SoundTestConstants.oldName })
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound] })
    expect(library).toMatchObject({ canUndo: false, canRedo: false })

    library.setSoundName(sound.id, SoundTestConstants.newName)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.getSound(sound.id).name).toEqual(SoundTestConstants.newName)
    await flushPromises()
    expect(soundStore.getSound(sound.id).name).toEqual(SoundTestConstants.newName)
    expect(library).toMatchObject({ canUndo: true, canRedo: false })

    library.undo()

    expect(listener).toHaveBeenCalledTimes(2)
    expect(library.getSound(sound.id).name).toEqual(SoundTestConstants.oldName)
    await flushPromises()
    expect(soundStore.getSound(sound.id).name).toEqual(SoundTestConstants.oldName)
    expect(library).toMatchObject({ canUndo: false, canRedo: true })

    library.redo()

    expect(listener).toHaveBeenCalledTimes(3)
    expect(library.getSound(sound.id).name).toEqual(SoundTestConstants.newName)
    await flushPromises()
    expect(soundStore.getSound(sound.id).name).toEqual(SoundTestConstants.newName)
  })

  test('redo stack should be cleared when a new action is performed', async () => {
    const sound = makeSound({ name: 'Name 1' })
    const { library } = await setUpTest({ sounds: [sound] })

    library.setSoundName(sound.id, 'Name 2')
    expect(library.getSound(sound.id).name).toEqual('Name 2')
    expect(library).toMatchObject({ canUndo: true, canRedo: false })

    library.undo()
    expect(library.getSound(sound.id).name).toEqual('Name 1')
    expect(library).toMatchObject({ canUndo: false, canRedo: true })

    library.setSoundName(sound.id, 'Name 3')
    expect(library.getSound(sound.id).name).toEqual('Name 3')
    expect(library).toMatchObject({ canUndo: true, canRedo: false })

    library.redo()
    expect(library.getSound(sound.id).name).toEqual('Name 3')
  })
})
