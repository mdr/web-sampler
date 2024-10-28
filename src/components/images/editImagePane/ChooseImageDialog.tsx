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

import { useImages } from '../../../sounds/library/imageHooks.ts'
import { useSoundActions } from '../../../sounds/library/soundHooks.ts'
import { Image, ImageId, getImageDisplayName } from '../../../types/Image.ts'
import { SoundId } from '../../../types/Sound.ts'
import { Option } from '../../../utils/types/Option.ts'
import { Button } from '../../shared/Button.tsx'
import { ButtonVariant } from '../../shared/ButtonVariant.tsx'
import { ChooseImageDialogTestIds } from './EditImagePaneTestIds.ts'

export interface ChooseImageDialogProps {
  soundId: SoundId
}

export const ChooseImageDialog = ({ soundId }: ChooseImageDialogProps) => {
  const soundActions = useSoundActions()
  const images = useImages()
  const [selectedImageId, setSelectedImageId] = useState<Option<ImageId>>(undefined)

  const handleAddButtonPressed = (close: () => void) => () => {
    if (selectedImageId === undefined) {
      throw new Error('selectedImageId is undefined')
    }
    soundActions.setImage(soundId, selectedImageId)
    close()
  }

  const handleSelectionChange = (key: Key | null) => {
    if (typeof key === 'number') {
      throw new Error('Key cannot be a number')
    }
    const soundId = key === null ? undefined : ImageId(key)
    setSelectedImageId(soundId)
  }

  return (
    <Dialog data-testid={ChooseImageDialogTestIds.dialog} className="relative outline-none">
      {({ close }) => {
        return (
          <>
            <Heading slot="title" className="my-0 text-lg font-semibold leading-6 text-slate-700">
              Choose Image
            </Heading>
            <ComboBox aria-label="Image" defaultItems={images} onSelectionChange={handleSelectionChange}>
              <div className="mt-2 flex items-center">
                <Input className="flex-grow rounded-l-md rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <RacButton
                  data-testid={ChooseImageDialogTestIds.comboBoxDropdownButton}
                  className="-ml-10 bg-transparent px-3 py-2 text-gray-700"
                >
                  ▼
                </RacButton>
              </div>
              <Popover className="entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out mt-2 w-[--trigger-width] rounded-md bg-white shadow-lg">
                <ListBox
                  data-testid={ChooseImageDialogTestIds.comboBoxItems}
                  className="max-h-60 overflow-y-auto rounded-md border border-gray-300"
                >
                  {(image: Image) => (
                    <ListBoxItem
                      key={image.id}
                      textValue={getImageDisplayName(image)}
                      className="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-blue-500 hover:text-white focus:bg-blue-500 focus:text-white focus:outline-none"
                    >
                      {({ isSelected }) => (
                        <>
                          <span
                            data-testid={ChooseImageDialogTestIds.imageOption}
                            className="flex flex-1 items-center gap-3 truncate font-normal group-selected:font-medium"
                          >
                            {getImageDisplayName(image)}
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
              {selectedImageId && (
                <Button
                  testId={ChooseImageDialogTestIds.addButton}
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
