import flushPromises from 'flush-promises'
import { describe, expect, it } from 'vitest'

import { Soundboard } from '../../types/Soundboard.ts'
import { SoundTestConstants, makeSound } from '../../types/sound.testSupport.ts'
import { SoundboardTestConstants, makeSoundboard, makeSoundboardTile } from '../../types/soundboard.testSupport.ts'
import { setUpTest } from './SoundLibrary.testSupport.ts'

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

it('should allow a soundboard to be deleted', async () => {
  const soundboard = makeSoundboard()
  const { library, soundStore, listener } = await setUpTest({ soundboards: [soundboard] })

  library.deleteSoundboard(soundboard.id)

  expect(listener).toHaveBeenCalledTimes(1)
  expect(library.soundboards).toEqual([])
  await flushPromises()
  expect(soundStore.soundboards).toEqual([])
})

it('should allow a soundboard name to be changed', async () => {
  const soundboard = makeSoundboard({ name: SoundboardTestConstants.oldName })
  const { library, soundStore, listener } = await setUpTest({ soundboards: [soundboard] })

  library.setSoundboardName(soundboard.id, SoundboardTestConstants.newName)

  expect(listener).toHaveBeenCalledTimes(1)
  const updatedSoundboards = [{ ...soundboard, name: SoundboardTestConstants.newName }]
  expect(library.soundboards).toEqual(updatedSoundboards)
  await flushPromises()
  expect(soundStore.soundboards).toEqual(updatedSoundboards)
})

describe('addSoundToSoundboard', () => {
  it('should allow a sound to be added to a soundboard', async () => {
    const sound1 = makeSound()
    const sound2 = makeSound()
    const tile1 = makeSoundboardTile({ soundId: sound1.id })
    const soundboard = makeSoundboard({ tiles: [tile1] })
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound1, sound2], soundboards: [soundboard] })

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
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound], soundboards: [soundboard] })

    library.addSoundToSoundboard(soundboard.id, sound.id)

    expect(listener).not.toHaveBeenCalled()
    expect(library.soundboards).toEqual([soundboard])
    await flushPromises()
    expect(soundStore.soundboards).toEqual([soundboard])
  })

  it('should throw an error if the soundboard ID is not valid', async () => {
    const sound = makeSound({ id: SoundTestConstants.id })
    const { library } = await setUpTest({ sounds: [sound] })

    expect(() => library.addSoundToSoundboard(SoundboardTestConstants.id, sound.id)).toThrowErrorMatchingInlineSnapshot(
      '[Error: Soundboard with id SoundboardTestConstants.id does not exist]',
    )
  })

  it('should throw an error if the sound ID is not valid', async () => {
    const soundboard = makeSoundboard()
    const sound = makeSound({ id: SoundTestConstants.id })
    const { library } = await setUpTest({ soundboards: [soundboard] })

    expect(() => library.addSoundToSoundboard(soundboard.id, sound.id)).toThrowErrorMatchingInlineSnapshot(
      '[Error: Sound with id SoundTestConstants.id does not exist]',
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
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound1, sound2], soundboards: [soundboard] })

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
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound], soundboards: [soundboard] })

    library.removeSoundFromSoundboard(soundboard.id, sound.id)

    expect(listener).not.toHaveBeenCalled()
    expect(library.soundboards).toEqual([soundboard])
    await flushPromises()
    expect(soundStore.soundboards).toEqual([soundboard])
  })

  it('should throw an error if the soundboard ID is not valid', async () => {
    const sound = makeSound({ id: SoundTestConstants.id })
    const { library } = await setUpTest({ sounds: [sound] })

    expect(() =>
      library.removeSoundFromSoundboard(SoundboardTestConstants.id, sound.id),
    ).toThrowErrorMatchingInlineSnapshot('[Error: Soundboard with id SoundboardTestConstants.id does not exist]')
  })

  it('should throw an error if the sound ID is not valid', async () => {
    const soundboard = makeSoundboard()
    const sound = makeSound({ id: SoundTestConstants.id })
    const { library } = await setUpTest({ soundboards: [soundboard] })

    expect(() => library.removeSoundFromSoundboard(soundboard.id, sound.id)).toThrowErrorMatchingInlineSnapshot(
      '[Error: Sound with id SoundTestConstants.id does not exist]',
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
    const { library, soundStore, listener } = await setUpTest({
      sounds: [sound1, sound2, sound3],
      soundboards: [soundboard],
    })

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
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound1, sound2], soundboards: [soundboard] })

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
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound1, sound2], soundboards: [soundboard] })

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
    ).toThrowErrorMatchingInlineSnapshot('[Error: Soundboard with id SoundboardTestConstants.id does not exist]')
  })

  it('should throw an error if the source sound ID is not valid', async () => {
    const soundboard = makeSoundboard({ id: SoundboardTestConstants.id, tiles: [] })
    const { library } = await setUpTest({ soundboards: [soundboard] })

    expect(() =>
      library.moveSoundInSoundboard(soundboard.id, SoundTestConstants.id, undefined),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Sound SoundTestConstants.id not found in soundboard SoundboardTestConstants.id]',
    )
  })

  it('should throw an error if the target sound ID is not valid', async () => {
    const sound = makeSound()
    const tile = makeSoundboardTile({ soundId: sound.id })
    const soundboard = makeSoundboard({ id: SoundboardTestConstants.id, tiles: [tile] })
    const { library } = await setUpTest({ sounds: [sound], soundboards: [soundboard] })

    expect(() =>
      library.moveSoundInSoundboard(soundboard.id, sound.id, SoundTestConstants.id),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Sound SoundTestConstants.id not found in soundboard SoundboardTestConstants.id]',
    )
  })

  it('should do nothing if the source and target sound IDs are the same', async () => {
    const sound = makeSound()
    const tile = makeSoundboardTile({ soundId: sound.id })
    const soundboard = makeSoundboard({ tiles: [tile] })
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound], soundboards: [soundboard] })

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
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound], soundboards: [soundboard] })

    library.setSoundboardTileShortcut(soundboard.id, sound.id, SoundboardTestConstants.shortcut)

    expect(listener).toHaveBeenCalledTimes(1)
    const updatedTile = { ...tile, shortcut: SoundboardTestConstants.shortcut }
    expect(library.getSoundboard(soundboard.id).tiles).toEqual([updatedTile])
    await flushPromises()
    expect(soundStore.getSoundboard(soundboard.id).tiles).toEqual([updatedTile])
  })

  it('should allow a shortcut to be cleared for a soundboard tile', async () => {
    const sound = makeSound()
    const tile = makeSoundboardTile({ soundId: sound.id, shortcut: SoundboardTestConstants.shortcut })
    const soundboard = makeSoundboard({ tiles: [tile] })
    const { library, soundStore, listener } = await setUpTest({ sounds: [sound], soundboards: [soundboard] })

    library.clearSoundboardTileShortcut(soundboard.id, sound.id)

    expect(listener).toHaveBeenCalledTimes(1)
    const updatedTile = { ...tile, shortcut: undefined }
    expect(library.getSoundboard(soundboard.id).tiles).toEqual([updatedTile])
    await flushPromises()
    expect(soundStore.getSoundboard(soundboard.id).tiles).toEqual([updatedTile])
  })

  it('should throw an error if the soundboard ID is not valid', async () => {
    const sound = makeSound()
    const { library } = await setUpTest({ sounds: [sound] })

    expect(() =>
      library.setSoundboardTileShortcut(SoundboardTestConstants.id, sound.id, SoundboardTestConstants.shortcut),
    ).toThrowErrorMatchingInlineSnapshot('[Error: Soundboard with id SoundboardTestConstants.id does not exist]')
  })

  it('should throw an error if the sound ID is not valid', async () => {
    const soundboard = makeSoundboard({ id: SoundboardTestConstants.id })
    const { library } = await setUpTest({ soundboards: [soundboard] })

    expect(() =>
      library.setSoundboardTileShortcut(soundboard.id, SoundTestConstants.id, SoundboardTestConstants.shortcut),
    ).toThrowErrorMatchingInlineSnapshot(
      '[Error: Sound SoundTestConstants.id not found in soundboard SoundboardTestConstants.id]',
    )
  })
})
