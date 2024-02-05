import Icon from '@mdi/react'
import { mdiPlus } from '@mdi/js'
import { doNothing } from '../../utils/utils.ts'
import { Button } from 'react-aria-components'
import { HomePageTestIds } from './HomePage.testIds.ts'

interface NewSoundButtonProps {
  onPress: () => void
}
 
export const NewSoundButton = ({ onPress = doNothing }: NewSoundButtonProps) => (
  <Button
    data-testid={HomePageTestIds.newSoundButton}
    className="bg-green-500 hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring focus:ring-green-300 text-white font-bold py-2 px-4 rounded disabled:bg-green-300 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
    onPress={onPress}
  >
    <Icon className="w-4 h-4 mr-2" path={mdiPlus} size={1} />
    New Sound
  </Button>
)
