import flushPromises from 'flush-promises'
import { describe, expect, it, test } from 'vitest'

import { makeImage } from '../../types/image.testSupport.ts'
import { SoundTestConstants, makeSound } from '../../types/sound.testSupport.ts'
import { makeSoundboard } from '../../types/soundboard.testSupport.ts'
import { MemorySoundStore } from '../store/MemorySoundStore.testSupport.ts'
import { setUpTest } from './SoundLibrary.testSupport.ts'
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
  const soundboard = makeSoundboard()
  const image = makeImage()
  const soundStore = new MemorySoundStore([sound], [soundboard], [image])
  const library = new SoundLibrary(soundStore)
  expect(library.isLoading).toBe(true)

  expect(library.newSound).toThrowErrorMatchingInlineSnapshot(
    '[Error: Cannot manipulate sounds yet as they are still loading]',
  )
  expect(() => library.newSoundboard()).toThrowErrorMatchingInlineSnapshot(
    '[Error: Cannot manipulate sounds yet as they are still loading]',
  )
  expect(() => library.newImage()).toThrowErrorMatchingInlineSnapshot(
    '[Error: Cannot manipulate sounds yet as they are still loading]',
  )
  expect(() => library.deleteSound(sound.id)).toThrowErrorMatchingInlineSnapshot(
    '[Error: Cannot manipulate sounds yet as they are still loading]',
  )
  expect(() => library.setSoundName(sound.id, SoundTestConstants.name)).toThrowError()
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
