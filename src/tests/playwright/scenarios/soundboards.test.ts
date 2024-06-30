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
