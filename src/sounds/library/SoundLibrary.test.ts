import flushPromises from 'flush-promises'
import { describe, expect, it, test } from 'vitest'

import { Sound, SoundId, newSoundId } from '../../types/Sound.ts'
import { SoundAudio } from '../../types/SoundAudio.ts'
import { Soundboard } from '../../types/Soundboard.ts'
import { SoundTestConstants, makePcm, makeSound, makeSoundWithAudio } from '../../types/sound.testSupport.ts'
import { SoundboardTestConstants, makeSoundboard, makeSoundboardTile } from '../../types/soundboard.testSupport.ts'
import { mockFunction } from '../../utils/mockUtils.testSupport.ts'
import { pcmSlice } from '../../utils/pcmUtils.ts'
import { Samples, Volume } from '../../utils/types/brandedTypes.ts'
import { MemorySoundStore } from '../store/MemorySoundStore.testSupport.ts'
import { SoundStore } from '../store/SoundStore.ts'
import { SoundLibrary, SoundLibraryUpdatedListener } from './SoundLibrary.ts'

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

    expect(library.newSound).toThrowErrorMatchingInlineSnapshot(
      `[Error: Cannot manipulate sounds yet as they are still loading]`,
    )
    expect(() => library.deleteSound(sound.id)).toThrowErrorMatchingInlineSnapshot(
      `[Error: Cannot manipulate sounds yet as they are still loading]`,
    )
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

  it('should support removing listeners', async () => {
    const sound = makeSound()
    const { library, listener } = await setUpTest([sound])

    library.removeListener(listener)

    library.setName(sound.id, SoundTestConstants.newName)
    expect(listener).not.toHaveBeenCalled()
  })

  describe('deleteSound', () => {
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
      const tile1 = makeSoundboardTile({ soundId: sound1.id })
      const tile2 = makeSoundboardTile({ soundId: sound2.id })
      const soundboard = makeSoundboard({ tiles: [tile1, tile2] })
      const { library, soundStore } = await setUpTest([sound1, sound2], [soundboard])

      library.deleteSound(sound1.id)

      const expectedSoundboard: Soundboard = { ...soundboard, tiles: [tile2] }
      expect(library.soundboards).toEqual([expectedSoundboard])
      await flushPromises()
      expect(soundStore.soundboards).toEqual([expectedSoundboard])
    })
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

  describe('importSounds', () => {
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

    it('should clear soundboards when importing sounds', async () => {
      const sound = makeSound()
      const tile = makeSoundboardTile({ soundId: sound.id })
      const soundboard = makeSoundboard({ tiles: [tile] })
      const { library } = await setUpTest([sound], [soundboard])
      const newSounds = [makeSound()]

      library.importSounds(newSounds)

      expect(library.soundboards).toEqual([])
    })
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
    expect(soundboard.tiles).toEqual([])
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

  it('should allow a sound to be duplicated', async () => {
    const sound = makeSound()
    const { library, soundStore, listener } = await setUpTest([sound])

    library.duplicateSound(sound.id)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.sounds).toIncludeSameMembers([sound, { ...sound, id: expect.anything() as SoundId }])
    await flushPromises()
    expect(soundStore.sounds).toIncludeSameMembers([sound, { ...sound, id: expect.anything() as SoundId }])
  })

  it('should allow audio data to be set', async () => {
    const sound = makeSound()
    const audioData = { pcm: makePcm(Samples(100)), sampleRate: SoundTestConstants.sampleRate }
    const { library, soundStore, listener } = await setUpTest([sound])

    library.setAudioData(sound.id, audioData)

    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.getSound(sound.id).audio).toMatchObject(audioData)
    await flushPromises()
    expect(soundStore.getSound(sound.id).audio).toMatchObject(audioData)
  })

  describe('addSoundToSoundboard', () => {
    it('should allow a sound to be added to a soundboard', async () => {
      const sound1 = makeSound()
      const sound2 = makeSound()
      const tile1 = makeSoundboardTile({ soundId: sound1.id })
      const soundboard = makeSoundboard({ tiles: [tile1] })
      const { library, soundStore, listener } = await setUpTest([sound1, sound2], [soundboard])

      library.addSoundToSoundboard(soundboard.id, sound2.id)

      expect(listener).toHaveBeenCalledTimes(1)
      const tile2 = makeSoundboardTile({ soundId: sound2.id })
      const updatedSoundboards = [{ ...soundboard, tiles: [tile1, tile2] }]
      expect(library.soundboards).toEqual(updatedSoundboards)
      await flushPromises()
      expect(soundStore.soundboards).toEqual(updatedSoundboards)
    })

    it('should do nothing if a sound is already in the soundboard', async () => {
      const sound = makeSound()
      const tile = makeSoundboardTile({ soundId: sound.id })
      const soundboard = makeSoundboard({ tiles: [tile] })
      const { library, soundStore, listener } = await setUpTest([sound], [soundboard])

      library.addSoundToSoundboard(soundboard.id, sound.id)

      expect(listener).not.toHaveBeenCalled()
      expect(library.soundboards).toEqual([soundboard])
      await flushPromises()
      expect(soundStore.soundboards).toEqual([soundboard])
    })

    it('should throw an error if the soundboard ID is not valid', async () => {
      const sound = makeSound({ id: SoundTestConstants.id })
      const { library } = await setUpTest([sound], [])

      expect(() =>
        library.addSoundToSoundboard(SoundboardTestConstants.id, sound.id),
      ).toThrowErrorMatchingInlineSnapshot(`[Error: Soundboard with id SoundboardTestConstants.id does not exist]`)
    })

    it('should throw an error if the sound ID is not valid', async () => {
      const soundboard = makeSoundboard()
      const sound = makeSound({ id: SoundTestConstants.id })
      const { library } = await setUpTest([], [soundboard])

      expect(() => library.addSoundToSoundboard(soundboard.id, sound.id)).toThrowErrorMatchingInlineSnapshot(
        `[Error: Sound with id SoundTestConstants.id does not exist]`,
      )
    })
  })

  describe('removeSoundFromSoundboard', () => {
    it('should allow a sound to be removed from the soundboard', async () => {
      const sound1 = makeSound()
      const sound2 = makeSound()
      const tile1 = makeSoundboardTile({ soundId: sound1.id })
      const tile2 = makeSoundboardTile({ soundId: sound2.id })
      const soundboard = makeSoundboard({ tiles: [tile1, tile2] })
      const { library, soundStore, listener } = await setUpTest([sound1, sound2], [soundboard])

      library.removeSoundFromSoundboard(soundboard.id, sound1.id)

      expect(listener).toHaveBeenCalledTimes(1)
      const updatedSoundboard: Soundboard = { ...soundboard, tiles: [tile2] }
      const updatedSoundboards = [updatedSoundboard]
      expect(library.soundboards).toEqual(updatedSoundboards)
      expect(library.sounds).toIncludeSameMembers([sound1, sound2])
      await flushPromises()
      expect(soundStore.soundboards).toEqual(updatedSoundboards)
    })

    it('should do nothing if sound is not in the soundboard', async () => {
      const sound = makeSound()
      const soundboard = makeSoundboard({ tiles: [] })
      const { library, soundStore, listener } = await setUpTest([sound], [soundboard])

      library.removeSoundFromSoundboard(soundboard.id, sound.id)

      expect(listener).not.toHaveBeenCalled()
      expect(library.soundboards).toEqual([soundboard])
      await flushPromises()
      expect(soundStore.soundboards).toEqual([soundboard])
    })

    it('should throw an error if the soundboard ID is not valid', async () => {
      const sound = makeSound({ id: SoundTestConstants.id })
      const { library } = await setUpTest([sound], [])

      expect(() =>
        library.removeSoundFromSoundboard(SoundboardTestConstants.id, sound.id),
      ).toThrowErrorMatchingInlineSnapshot(`[Error: Soundboard with id SoundboardTestConstants.id does not exist]`)
    })

    it('should throw an error if the sound ID is not valid', async () => {
      const soundboard = makeSoundboard()
      const sound = makeSound({ id: SoundTestConstants.id })
      const { library } = await setUpTest([], [soundboard])

      expect(() => library.removeSoundFromSoundboard(soundboard.id, sound.id)).toThrowErrorMatchingInlineSnapshot(
        `[Error: Sound with id SoundTestConstants.id does not exist]`,
      )
    })
  })

  describe('moveSoundInSoundboard', () => {
    it('should allow sounds to be moved within a soundboard', async () => {
      const sound1 = makeSound()
      const sound2 = makeSound()
      const sound3 = makeSound()
      const tile1 = makeSoundboardTile({ soundId: sound1.id })
      const tile2 = makeSoundboardTile({ soundId: sound2.id })
      const tile3 = makeSoundboardTile({ soundId: sound3.id })
      const soundboard = makeSoundboard({ tiles: [tile1, tile2, tile3] })
      const { library, soundStore, listener } = await setUpTest([sound1, sound2, sound3], [soundboard])

      library.moveSoundInSoundboard(soundboard.id, sound1.id, sound3.id)

      expect(listener).toHaveBeenCalledTimes(1)
      const updatedSoundboard: Soundboard = { ...soundboard, tiles: [tile2, tile1, tile3] }
      const updatedSoundboards = [updatedSoundboard]
      expect(library.soundboards).toEqual(updatedSoundboards)
      await flushPromises()
      expect(soundStore.soundboards).toEqual(updatedSoundboards)
    })

    it('should allow sounds to be moved to the start of a soundboard', async () => {
      const sound1 = makeSound()
      const sound2 = makeSound()
      const tile1 = makeSoundboardTile({ soundId: sound1.id })
      const tile2 = makeSoundboardTile({ soundId: sound2.id })
      const soundboard = makeSoundboard({ tiles: [tile1, tile2] })
      const { library, soundStore, listener } = await setUpTest([sound1, sound2], [soundboard])

      library.moveSoundInSoundboard(soundboard.id, sound2.id, sound1.id)

      expect(listener).toHaveBeenCalledTimes(1)
      const updatedSoundboard: Soundboard = { ...soundboard, tiles: [tile2, tile1] }
      const updatedSoundboards = [updatedSoundboard]
      expect(library.soundboards).toEqual(updatedSoundboards)
      await flushPromises()
      expect(soundStore.soundboards).toEqual(updatedSoundboards)
    })

    it('should allow sounds to be moved to the end of a soundboard', async () => {
      const sound1 = makeSound()
      const sound2 = makeSound()
      const tile1 = makeSoundboardTile({ soundId: sound1.id })
      const tile2 = makeSoundboardTile({ soundId: sound2.id })
      const soundboard = makeSoundboard({ tiles: [tile1, tile2] })
      const { library, soundStore, listener } = await setUpTest([sound1, sound2], [soundboard])

      library.moveSoundInSoundboard(soundboard.id, sound1.id, undefined)

      expect(listener).toHaveBeenCalledTimes(1)
      const updatedSoundboard: Soundboard = { ...soundboard, tiles: [tile2, tile1] }
      const updatedSoundboards = [updatedSoundboard]
      expect(library.soundboards).toEqual(updatedSoundboards)
      await flushPromises()
      expect(soundStore.soundboards).toEqual(updatedSoundboards)
    })

    it('should throw an error if the soundboard ID is not valid', async () => {
      const { library } = await setUpTest()

      expect(() =>
        library.moveSoundInSoundboard(SoundboardTestConstants.id, SoundTestConstants.id, undefined),
      ).toThrowErrorMatchingInlineSnapshot(`[Error: Soundboard with id SoundboardTestConstants.id does not exist]`)
    })

    it('should throw an error if the source sound ID is not valid', async () => {
      const soundboard = makeSoundboard({ id: SoundboardTestConstants.id, tiles: [] })
      const { library } = await setUpTest([], [soundboard])

      expect(() =>
        library.moveSoundInSoundboard(soundboard.id, SoundTestConstants.id, undefined),
      ).toThrowErrorMatchingInlineSnapshot(
        `[Error: Sound SoundTestConstants.id not found in soundboard SoundboardTestConstants.id]`,
      )
    })

    it('should throw an error if the target sound ID is not valid', async () => {
      const sound = makeSound()
      const tile = makeSoundboardTile({ soundId: sound.id })
      const soundboard = makeSoundboard({ id: SoundboardTestConstants.id, tiles: [tile] })
      const { library } = await setUpTest([sound], [soundboard])

      expect(() =>
        library.moveSoundInSoundboard(soundboard.id, sound.id, SoundTestConstants.id),
      ).toThrowErrorMatchingInlineSnapshot(
        `[Error: Sound SoundTestConstants.id not found in soundboard SoundboardTestConstants.id]`,
      )
    })

    it('should do nothing if the source and target sound IDs are the same', async () => {
      const sound = makeSound()
      const tile = makeSoundboardTile({ soundId: sound.id })
      const soundboard = makeSoundboard({ tiles: [tile] })
      const { library, soundStore, listener } = await setUpTest([sound], [soundboard])

      library.moveSoundInSoundboard(soundboard.id, sound.id, sound.id)

      expect(listener).not.toHaveBeenCalled()
      expect(library.soundboards).toEqual([soundboard])
      await flushPromises()
      expect(soundStore.soundboards).toEqual([soundboard])
    })
  })

  describe('setSoundboardTileShortcut', () => {
    it('should allow a shortcut to be set for a soundboard tile', async () => {
      const sound = makeSound()
      const tile = makeSoundboardTile({ soundId: sound.id, shortcut: undefined })
      const soundboard = makeSoundboard({ tiles: [tile] })
      const { library, soundStore, listener } = await setUpTest([sound], [soundboard])

      library.setSoundboardTileShortcut(soundboard.id, sound.id, SoundboardTestConstants.shortcut)

      expect(listener).toHaveBeenCalledTimes(1)
      const updatedTile = { ...tile, shortcut: SoundboardTestConstants.shortcut }
      const updatedSoundboards = [{ ...soundboard, tiles: [updatedTile] }]
      expect(library.soundboards).toEqual(updatedSoundboards)
      await flushPromises()
      expect(soundStore.soundboards).toEqual(updatedSoundboards)
    })

    it('should allow a shortcut to be cleared for a soundboard tile', async () => {
      const sound = makeSound()
      const tile = makeSoundboardTile({ soundId: sound.id, shortcut: SoundboardTestConstants.shortcut })
      const soundboard = makeSoundboard({ tiles: [tile] })
      const { library, soundStore, listener } = await setUpTest([sound], [soundboard])

      library.setSoundboardTileShortcut(soundboard.id, sound.id, undefined)

      expect(listener).toHaveBeenCalledTimes(1)
      const updatedTile = { ...tile, shortcut: undefined }
      const updatedSoundboards = [{ ...soundboard, tiles: [updatedTile] }]
      expect(library.soundboards).toEqual(updatedSoundboards)
      await flushPromises()
      expect(soundStore.soundboards).toEqual(updatedSoundboards)
    })

    it('should throw an error if the soundboard ID is not valid', async () => {
      const sound = makeSound()
      const { library } = await setUpTest([sound])

      expect(() =>
        library.setSoundboardTileShortcut(SoundboardTestConstants.id, sound.id, SoundboardTestConstants.shortcut),
      ).toThrowErrorMatchingInlineSnapshot(`[Error: Soundboard with id SoundboardTestConstants.id does not exist]`)
    })

    it('should throw an error if the sound ID is not valid', async () => {
      const soundboard = makeSoundboard({ id: SoundboardTestConstants.id })
      const { library } = await setUpTest([], [soundboard])

      expect(() =>
        library.setSoundboardTileShortcut(soundboard.id, SoundTestConstants.id, SoundboardTestConstants.shortcut),
      ).toThrowErrorMatchingInlineSnapshot(
        `[Error: Sound SoundTestConstants.id not found in soundboard SoundboardTestConstants.id]`,
      )
    })
  })

  describe('undo/redo', () => {
    it('should support undo and redo', async () => {
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

  it('should allow an image to be created', async () => {
    const { library, soundStore, listener } = await setUpTest()

    const image = library.newImage()

    expect(image.name).toEqual('')
    expect(listener).toHaveBeenCalledTimes(1)
    expect(library.images).toEqual([image])
    await flushPromises()
    expect(soundStore.images).toEqual([image])
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
