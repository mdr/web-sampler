import {
  Button as RacButton,
  ComboBox,
  Dialog,
  Heading,
  Input,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { Button, ButtonVariant } from '../../shared/Button.tsx'
import { useSounds } from '../../../sounds/soundHooks.ts'
import { getSoundDisplayName, sortSoundsByDisplayName } from '../../../types/Sound.ts'
import Icon from '@mdi/react'
import { mdiCheck } from '@mdi/js'

export const AddSoundDialog = () => {
  const sounds = sortSoundsByDisplayName(useSounds())
  return (
    <Dialog data-testid={EditSoundboardPaneTestIds.chooseSoundDialog} className="relative outline-none">
      {({ close }) => {
        return (
          <>
            <Heading slot="title" className="my-0 text-lg font-semibold leading-6 text-slate-700">
              Choose Sound
            </Heading>
            <ComboBox aria-label="Sound">
              <div className="mt-2 flex items-center">
                <Input className="flex-grow rounded-l-md rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <RacButton className="-ml-10 bg-transparent px-3 py-2 text-gray-700">▼</RacButton>
              </div>
              <Popover className="entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out mt-2 w-[--trigger-width] rounded-md bg-white shadow-lg">
                <ListBox className="max-h-60 overflow-y-auto rounded-md border border-gray-300">
                  {sounds.map((sound) => (
                    <ListBoxItem
                      key={sound.id}
                      textValue={getSoundDisplayName(sound)}
                      className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white focus:outline-none"
                    >
                      {({ isSelected }) => (
                        <>
                          <span className="group-selected:font-medium flex flex-1 items-center gap-3 truncate font-normal">
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
                  ))}
                </ListBox>
              </Popover>
            </ComboBox>
            <div className="mt-6 flex justify-end">
              <Button variant={ButtonVariant.PRIMARY} label="Close" onPress={close} />
            </div>
          </>
        )
      }}
    </Dialog>
  )
}
