import { Input, Label, TextField } from 'react-aria-components'

export interface SoundNameTextFieldProps {
  soundName: string
  setSoundName: (soundName: string) => void
  onBlur: () => void
}

export const SoundNameTextField = ({ soundName, setSoundName, onBlur }: SoundNameTextFieldProps) => (
  <TextField className="flex flex-col space-y-2 p-4">
    <Label className="font-medium text-gray-700">Sound Name</Label>
    <Input
      data-1p-ignore
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
      value={soundName}
      placeholder="Enter sound name"
      onChange={(e) => setSoundName(e.target.value)}
      onBlur={onBlur}
    />
  </TextField>
)
