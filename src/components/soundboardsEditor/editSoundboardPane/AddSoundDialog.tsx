import {
  Button as RacButton,
  ComboBox,
  Dialog,
  Heading,
  Input,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
} from 'react-aria-components'
import { EditSoundboardPaneTestIds } from './EditSoundboardPaneTestIds.ts'
import { Button, ButtonVariant } from '../../shared/Button.tsx'
import { useSounds } from '../../../sounds/soundHooks.ts'
import { getSoundDisplayName } from '../../../types/Sound.ts'

export const AddSoundDialog = () => {
  const sounds = useSounds()
  return (
    <Dialog data-testid={EditSoundboardPaneTestIds.chooseSoundDialog} className="relative outline-none">
      {({ close }) => {
        return (
          <>
            <Heading slot="title" className="my-0 text-lg font-semibold leading-6 text-slate-700">
              Choose Sound
            </Heading>
            <ComboBox>
              <Label>Sound</Label>
              <div className="flex items-center">
                <Input className="focus:ring-focus-ring-color rounded-l-md border border-r-0 px-3 py-2 focus:outline-none focus:ring-2" />
                <RacButton className="bg-highlight-background text-highlight-foreground rounded-r-md border border-l-0 px-2 py-2">
                  ▼
                </RacButton>
              </div>
              <Popover className="w-64">
                <ListBox className="max-h-60 overflow-y-auto border-0">
                  {sounds.map((sound) => (
                    <ListBoxItem
                      key={sound.id}
                      className="hover:bg-highlight-background hover:text-highlight-foreground px-4 py-2"
                    >
                      {getSoundDisplayName(sound)}
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
