import { Navbar } from './NavBar.tsx'
import { Button } from 'react-aria-components'

export const App = () => (
  <>
    <Navbar />
    <div className="flex items-baseline space-x-4 p-4">
      <Button
        className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring focus:ring-blue-300 text-white font-bold py-2 px-4 rounded"
        onPress={() => undefined}
      >
        Sample
      </Button>
    </div>
  </>
)
