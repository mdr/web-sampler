import { describe, expect, it, test } from 'vitest'
import { SoundLibrary, SoundLibraryUpdatedListener } from './SoundLibrary.ts'
import { MemorySoundStore } from './MemorySoundStore.testSupport.ts'
import flushPromises from 'flush-promises'
import { makePcm, makeSound, makeSoundWithAudio, SoundTestConstants } from '../types/sound.testSupport.ts'
import { newSoundId, Sound } from '../types/Sound.ts'
import { SoundStore } from './SoundStore.ts'
import { mockFunction } from '../utils/mockUtils.testSupport.ts'
import { Samples, Volume } from '../utils/types/brandedTypes.ts'
import { makeSoundboard, SoundboardTestConstants } from '../types/soundboard.testSupport.ts'
import { Soundboard } from '../types/Soundboard.ts'
import { pcmSlice } from '../utils/pcmUtils.ts'
import { SoundAudio } from '../types/SoundAudio.ts'

describe('SoundLibrary', () => {
  it('should load sounds from the store on creation', async () => {
    const sounds = [makeSound()]
    const soundBoards = [makeSoundboard()]
    const soundStore = new MemorySoundStore(sounds, soundBoards)
    const library = new SoundLibrary(soundStore)
    expect(library.isLoading).toBe(true)
    expect(library.sounds).toEqual([])
    expect(library.soundboards).toEqual([])

    await flushPromises()

    expect(library.isLoading).toBe(false)
    expect(library.sounds).toIncludeSameMembers(sounds)
    expect(library.soundboards).toIncludeSameMembers(soundBoards)
  })

  it('should not allow sounds to be modified while still loading', () => {
    const sound = makeSound()
    const soundStore = new MemorySoundStore([sound])
    const library = new SoundLibrary(soundStore)
    expect(library.isLoading).toBe(true)

    expect(library.newSound).toThrowError()
    expect(() => library.deleteSound(sound.id)).toThrowError()
    expect(() => library.setName(sound.id, SoundTestConstants.name)).toThrowError()
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

  it('should allow a sound to be deleted', async () => {
    const sound = makeSound()
    const { library, soundStore, listener } = await setUpTest([sound])

    library.deleteSound(sound.id)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.sounds).toEqual([])
    await flushPromises()
    expect(soundStore.sounds).toEqual([])
  })

  it('should remove a sound from any soundboard it is in when deleted', async () => {
    const sound1 = makeSound()
    const sound2 = makeSound()
    const soundboard = makeSoundboard({ sounds: [sound1.id, sound2.id] })
    const { library, soundStore } = await setUpTest([sound1, sound2], [soundboard])

    library.deleteSound(sound1.id)

    const expectedSoundboard = { ...soundboard, sounds: [sound2.id] }
    expect(library.soundboards).toEqual([expectedSoundboard])
    await flushPromises()
    expect(soundStore.soundboards).toEqual([expectedSoundboard])
  })

  it('should allow a sound name to be changed', async () => {
    const sound = makeSound({ name: SoundTestConstants.oldName })
    const { library, soundStore, listener } = await setUpTest([sound])

    library.setName(sound.id, SoundTestConstants.newName)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.getSound(sound.id).name).toEqual(SoundTestConstants.newName)
    await flushPromises()
    expect(soundStore.getSound(sound.id).name).toEqual(SoundTestConstants.newName)
  })

  it('should allow sounds to be imported', async () => {
    const oldSounds = [makeSound()]
    const { library, soundStore, listener } = await setUpTest(oldSounds)
    const newSounds = [makeSound()]

    library.importSounds(newSounds)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.sounds).toEqual(newSounds)
    await flushPromises()
    expect(soundStore.sounds).toEqual(newSounds)
  })

  it('should allow the volume of a sound to be set', async () => {
    const sound = makeSoundWithAudio({ volume: Volume(1) })
    const { library, soundStore, listener } = await setUpTest([sound])

    library.setVolume(sound.id, Volume(0.5))

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.getSound(sound.id).audio?.volume).toEqual(Volume(0.5))
    await flushPromises()
    expect(soundStore.getSound(sound.id).audio?.volume).toEqual(Volume(0.5))
  })

  it('should allow the audio of a sound to be cropped', async () => {
    const pcm = makePcm(Samples(100))
    const sound = makeSoundWithAudio({ pcm, start: Samples(10), finish: Samples(90) })
    const { library, soundStore, listener } = await setUpTest([sound])

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
    const { library, listener } = await setUpTest([sound])

    library.setAudioStart(sound.id, Samples(15))

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.getSound(sound.id).audio?.start).toEqual(Samples(15))
    await flushPromises()
    expect(library.getSound(sound.id).audio?.start).toEqual(Samples(15))
  })

  it('should allow a sound finish time to be updated', async () => {
    const sound = makeSoundWithAudio({ start: Samples(10), finish: Samples(20) })
    const { library, listener } = await setUpTest([sound])

    library.setAudioFinish(sound.id, Samples(15))

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.getSound(sound.id).audio?.finish).toEqual(Samples(15))
    await flushPromises()
    expect(library.getSound(sound.id).audio?.finish).toEqual(Samples(15))
  })

  it('should allow a soundboard to be created', async () => {
    const { library, soundStore, listener } = await setUpTest()

    const soundboard = library.newSoundboard()

    expect(soundboard.name).toEqual('')
    expect(soundboard.sounds).toEqual([])
    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.soundboards).toEqual([soundboard])
    await flushPromises()
    expect(soundStore.soundboards).toEqual([soundboard])
  })

  it('should allow a soundboard name to be changed', async () => {
    const soundboard = makeSoundboard({ name: SoundboardTestConstants.oldName })
    const { library, soundStore, listener } = await setUpTest([], [soundboard])

    library.setSoundboardName(soundboard.id, SoundboardTestConstants.newName)

    expect(listener).toHaveBeenCalledTimes(1)
    const updatedSoundboards = [{ ...soundboard, name: SoundboardTestConstants.newName }]
    expect(library.soundboards).toEqual(updatedSoundboards)
    await flushPromises()
    expect(soundStore.soundboards).toEqual(updatedSoundboards)
  })

  it('should allow a sound to be added to a soundboard', async () => {
    const sound1 = makeSound()
    const sound2 = makeSound()
    const soundboard = makeSoundboard({ sounds: [sound1.id] })
    const { library, soundStore, listener } = await setUpTest([sound1, sound2], [soundboard])

    library.addSoundToSoundboard(soundboard.id, sound2.id)

    expect(listener).toHaveBeenCalledTimes(1)
    const updatedSoundboards = [{ ...soundboard, sounds: [sound1.id, sound2.id] }]
    expect(library.soundboards).toEqual(updatedSoundboards)
    await flushPromises()
    expect(soundStore.soundboards).toEqual(updatedSoundboards)
  })

  it('should do nothing if a sound is already in a soundboard', async () => {
    const sound = makeSound()
    const soundboard = makeSoundboard({ sounds: [sound.id] })
    const { library, soundStore, listener } = await setUpTest([sound], [soundboard])

    library.addSoundToSoundboard(soundboard.id, sound.id)

    expect(listener).not.toHaveBeenCalled()
    expect(library.soundboards).toEqual([soundboard])
    await flushPromises()
    expect(soundStore.soundboards).toEqual([soundboard])
  })

  it('should throw an error of the sound ID is not valid', async () => {
    const soundboard = makeSoundboard({ sounds: [] })
    const sound = makeSound()
    const { library } = await setUpTest([], [soundboard])

    expect(() => library.addSoundToSoundboard(soundboard.id, sound.id)).toThrowError()
  })

  it('should allow undo and redo', async () => {
    const sound = makeSound({ name: SoundTestConstants.oldName })
    const { library, soundStore, listener } = await setUpTest([sound])
    expect(library).toMatchObject({ canUndo: false, canRedo: false })

    library.setName(sound.id, SoundTestConstants.newName)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.sounds).toEqual([{ ...sound, name: SoundTestConstants.newName }])
    await flushPromises()
    expect(soundStore.sounds).toEqual([{ ...sound, name: SoundTestConstants.newName }])
    expect(library).toMatchObject({ canUndo: true, canRedo: false })

    library.undo()

    expect(listener).toHaveBeenCalledTimes(2)
    expect(library.sounds).toEqual([sound])
    await flushPromises()
    expect(soundStore.sounds).toEqual([sound])
    expect(library).toMatchObject({ canUndo: false, canRedo: true })

    library.redo()

    expect(listener).toHaveBeenCalledTimes(3)
    expect(library.sounds).toEqual([{ ...sound, name: SoundTestConstants.newName }])
    await flushPromises()
    expect(soundStore.sounds).toEqual([{ ...sound, name: SoundTestConstants.newName }])
  })

  test('redo stack should be cleared when a new action is performed', async () => {
    const sound = makeSound({ name: 'Name 1' })
    const { library } = await setUpTest([sound])

    library.setName(sound.id, 'Name 2')
    expect(library.sounds).toEqual([{ ...sound, name: 'Name 2' }])
    expect(library).toMatchObject({ canUndo: true, canRedo: false })

    library.undo()
    expect(library.sounds).toEqual([sound])
    expect(library).toMatchObject({ canUndo: false, canRedo: true })

    library.setName(sound.id, 'Name 3')
    expect(library.sounds).toEqual([{ ...sound, name: 'Name 3' }])
    expect(library).toMatchObject({ canUndo: true, canRedo: false })

    library.redo()
    expect(library.sounds).toEqual([{ ...sound, name: 'Name 3' }])
  })
})

const setUpTest = async (initialSounds: Sound[] = [], initialSoundboards: Soundboard[] = []) => {
  const soundStore = new MemorySoundStore(initialSounds, initialSoundboards)
  const library = await makeLoadedSoundLibrary(soundStore)
  const listener = mockFunction<SoundLibraryUpdatedListener>()
  library.addListener(listener)
  return { library, soundStore, listener }
}

const makeLoadedSoundLibrary = async (soundStore: SoundStore): Promise<SoundLibrary> => {
  const library = new SoundLibrary(soundStore)
  await flushPromises()
  expect(library.isLoading).toBe(false)
  return library
}
