import InlineEdit from '@atlaskit/inline-edit'
import { Input, TextField } from 'react-aria-components'

import { imageNameAsDisplayName } from '../../../types/Image.ts'
import { EditImagePaneTestIds } from './EditImagePaneTestIds.ts'

export interface ImageNameTextFieldProps {
  name: string
  setName: (name: string) => void
}

export const ImageNameTextField = ({ name, setName }: ImageNameTextFieldProps) => (
  <InlineEdit
    readViewFitContainerWidth
    defaultValue={name}
    editView={({ value, onChange }) => (
      // my-[2px] - to avoid jitter when switching from read to edit view
      <TextField aria-label="Sound name" className="my-[2px] flex flex-col space-y-2">
        <Input
          data-testid={EditImagePaneTestIds.imageNameInput}
          className="block w-full rounded-md border border-gray-300 px-3 text-2xl shadow-xs focus:border-indigo-500 focus:outline-hidden focus:ring-indigo-500"
          value={value}
          autoFocus
          placeholder="Enter image name"
          onChange={(e) => onChange(e.target.value)}
          data-1p-ignore
        />
      </TextField>
    )}
    readView={() => (
      <h1 data-testid={EditImagePaneTestIds.imageNameInput} className="text-2xl">
        {imageNameAsDisplayName(name)}
      </h1>
    )}
    onConfirm={setName}
  />
)
