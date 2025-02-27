import { mdiCheck } from '@mdi/js'
import Icon from '@mdi/react'
import { useState } from 'react'
import {
  ComboBox,
  Dialog,
  Heading,
  Input,
  Key,
  ListBox,
  ListBoxItem,
  Popover,
  Button as RacButton,
} from 'react-aria-components'

import { useSoundboard, useSoundboardActions, useSounds } from '../../../sounds/library/soundHooks.ts'
import { Sound, SoundId, getSoundDisplayName, sortSoundsByDisplayName } from '../../../types/Sound.ts'
import { SoundboardId } from '../../../types/Soundboard.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { ChooseSoundDialogTestIds } from './EditSoundboardPaneTestIds.ts'

export interface ChooseSoundDialogProps {
  soundboardId: SoundboardId
}

export const ChooseSoundDialog = ({ soundboardId }: ChooseSoundDialogProps) => {
  const soundboard = useSoundboard(soundboardId)
  const soundboardSoundIds = soundboard.tiles.map((tile) => tile.soundId)
  const availableSounds = sortSoundsByDisplayName(useSounds().filter((sound) => !soundboardSoundIds.includes(sound.id)))
  const [selectedSoundId, setSelectedSoundId] = useState<Option<SoundId>>(undefined)
  const soundboardActions = useSoundboardActions()

  const handleAddButtonPressed = (close: () => void) => () => {
    if (selectedSoundId === undefined) {
      throw new Error('selectedSoundId is undefined')
    }
    soundboardActions.addSoundToSoundboard(soundboardId, selectedSoundId)
    close()
  }

  const handleSelectionChange = (key: Key | null) => {
    if (typeof key === 'number') {
      throw new Error('Key cannot be a number')
    }
    const soundId = key === null ? undefined : SoundId(key)
    setSelectedSoundId(soundId)
  }

  return (
    <Dialog data-testid={ChooseSoundDialogTestIds.dialog} className="relative outline-hidden">
      {({ close }) => {
        return (
          <>
            <Heading slot="title" className="my-0 text-lg font-semibold leading-6 text-slate-700">
              Choose Sound
            </Heading>
            <ComboBox aria-label="Sound" defaultItems={availableSounds} onSelectionChange={handleSelectionChange}>
              <div className="mt-2 flex items-center">
                <Input className="grow rounded-l-md rounded-r-md border border-gray-300 px-3 py-2 focus:outline-hidden focus:ring-2 focus:ring-blue-500" />
                <RacButton
                  data-testid={ChooseSoundDialogTestIds.comboBoxDropdownButton}
                  className="-ml-10 bg-transparent px-3 py-2 text-gray-700"
                >
                  ▼
                </RacButton>
              </div>
              <Popover className="entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out mt-2 w-(--trigger-width) rounded-md bg-white shadow-lg">
                <ListBox
                  data-testid={ChooseSoundDialogTestIds.comboBoxItems}
                  className="max-h-60 overflow-y-auto rounded-md border border-gray-300"
                >
                  {(sound: Sound) => (
                    <ListBoxItem
                      key={sound.id}
                      textValue={getSoundDisplayName(sound)}
                      className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white focus:outline-hidden"
                    >
                      {({ isSelected }) => (
                        <>
                          <span
                            data-testid={ChooseSoundDialogTestIds.soundOption}
                            className="flex flex-1 items-center gap-3 truncate font-normal group-selected:font-medium"
                          >
                            {getSoundDisplayName(sound)}
                          </span>
                          {isSelected && (
                            <span className="flex items-center text-sky-600 group-focus:text-white">
                              <Icon path={mdiCheck} size={1} />
                            </span>
                          )}
                        </>
                      )}
                    </ListBoxItem>
                  )}
                </ListBox>
              </Popover>
            </ComboBox>
            <div className="mt-6 flex justify-end space-x-2">
              {selectedSoundId && (
                <Button
                  testId={ChooseSoundDialogTestIds.addButton}
                  variant={ButtonVariant.PRIMARY}
                  label="Add"
                  onPress={handleAddButtonPressed(close)}
                />
              )}
              <Button label="Close" onPress={close} />
            </div>
          </>
        )
      }}
    </Dialog>
  )
}
