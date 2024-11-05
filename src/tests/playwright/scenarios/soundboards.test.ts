import { SoundTestConstants } from '../../../types/sound.testSupport.ts'
import { test } from '../fixtures.ts'
import { launchApp } from '../pageObjects/launchApp.tsx'

test('soundboards can be created and named', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  const soundboardsEditorPage = await soundsEditorPage.navbar.pressSoundboardsLink()

  await soundboardsEditorPage.sidebar.pressNewSoundboard()
  await soundboardsEditorPage.enterSoundboardName('Soundboard 11')

  await soundboardsEditorPage.sidebar.pressNewSoundboard()
  await soundboardsEditorPage.enterSoundboardName('Soundboard 9')

  await soundboardsEditorPage.sidebar.pressNewSoundboard()
  await soundboardsEditorPage.enterSoundboardName('Soundboard 10')

  await soundboardsEditorPage.sidebar.expectSoundboardNamesToBe(['Soundboard 9', 'Soundboard 10', 'Soundboard 11'])
})

test('soundboards can be deleted', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  const soundboardsEditorPage = await soundsEditorPage.navbar.pressSoundboardsLink()
  await soundboardsEditorPage.sidebar.pressNewSoundboard()

  await soundboardsEditorPage.pressDeleteSoundboard()

  await soundboardsEditorPage.sidebar.expectSoundboardNamesToBe([])
  await soundboardsEditorPage.expectToastToBeShown('Deleted soundboard Untitled Soundboard')
})

test('a soundboard without a name is displayed as "Untitled Soundboard"', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  const soundboardsEditorPage = await soundsEditorPage.navbar.pressSoundboardsLink()

  await soundboardsEditorPage.sidebar.pressNewSoundboard()

  await soundboardsEditorPage.sidebar.expectSoundboardNamesToBe(['Untitled Soundboard'])
})

test('soundboards can be renamed', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  const soundboardsEditorPage = await soundsEditorPage.navbar.pressSoundboardsLink()

  await soundboardsEditorPage.sidebar.pressNewSoundboard()
  await soundboardsEditorPage.enterSoundboardName('Soundboard AAA')
  await soundboardsEditorPage.sidebar.pressNewSoundboard()
  await soundboardsEditorPage.enterSoundboardName('Soundboard BBB')
  await soundboardsEditorPage.sidebar.pickSoundboard('Soundboard AAA')

  await soundboardsEditorPage.enterSoundboardName('Soundboard CCC')

  await soundboardsEditorPage.sidebar.expectSoundboardNamesToBe(['Soundboard BBB', 'Soundboard CCC'])
})

test('a sound can be added to a soundboard if not already present', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.createSound('ZZZ')
  await soundsEditorPage.createSound('XXX')
  await soundsEditorPage.createSound('YYY')
  const soundboardsEditorPage = await soundsEditorPage.navbar.pressSoundboardsLink()
  await soundboardsEditorPage.sidebar.pressNewSoundboard()
  let chooseSoundDialog = await soundboardsEditorPage.pressAddSound()
  await chooseSoundDialog.pressDropdownButton()
  await chooseSoundDialog.expectSoundOptionsToBe(['XXX', 'YYY', 'ZZZ'])

  await chooseSoundDialog.selectSoundOption('YYY')
  await chooseSoundDialog.pressAddButton()

  chooseSoundDialog = await soundboardsEditorPage.pressAddSound()
  await chooseSoundDialog.pressDropdownButton()
  await chooseSoundDialog.expectSoundOptionsToBe(['XXX', 'ZZZ'])
})

test('sounds can be rearranged by dragging', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.createSound('AAA')
  await soundsEditorPage.createSound('BBB')
  await soundsEditorPage.createSound('CCC')
  const soundboardsEditorPage = await soundsEditorPage.navbar.pressSoundboardsLink()
  await soundboardsEditorPage.sidebar.pressNewSoundboard()
  for (const sound of ['AAA', 'BBB', 'CCC']) {
    await soundboardsEditorPage.addSound(sound)
  }
  await soundboardsEditorPage.expectSoundTilesToBe(['AAA', 'BBB', 'CCC'])

  await soundboardsEditorPage.dragSound({ fromSoundName: 'CCC', toSoundName: 'AAA' })

  await soundboardsEditorPage.expectSoundTilesToBe(['CCC', 'AAA', 'BBB'])
})

test('sounds can be removed from a soundboard', async ({ mount }) => {
  const soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.createSound(SoundTestConstants.name)
  const soundboardsEditorPage = await soundsEditorPage.navbar.pressSoundboardsLink()
  await soundboardsEditorPage.sidebar.pressNewSoundboard()
  await soundboardsEditorPage.addSound(SoundTestConstants.name)
  await soundboardsEditorPage.expectSoundTilesToBe([SoundTestConstants.name])

  await soundboardsEditorPage.removeSoundFromSoundboard(SoundTestConstants.name)

  await soundboardsEditorPage.expectSoundTilesToBe([])
  const soundsPage = await soundboardsEditorPage.navbar.pressHomeLink()
  await soundsPage.sidebar.expectSoundNamesToBe([SoundTestConstants.name])
})

test('can navigate to a sound from a soundboard', async ({ mount }) => {
  let soundsEditorPage = await launchApp(mount)
  await soundsEditorPage.createSound('AAA')
  const soundboardsEditorPage = await soundsEditorPage.navbar.pressSoundboardsLink()
  await soundboardsEditorPage.sidebar.pressNewSoundboard()
  await soundboardsEditorPage.addSound('AAA')

  soundsEditorPage = await soundboardsEditorPage.editSound('AAA')

  await soundsEditorPage.enterSoundName('BBB')
  await soundsEditorPage.navigateBack()
  await soundboardsEditorPage.expectSoundTilesToBe(['BBB'])
})
