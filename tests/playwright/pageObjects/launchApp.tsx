import { MountFunction } from '../types'
import { HomePage } from './HomePage'
import { App } from '../../../src/components/App'

export const launchApp = async (mount: MountFunction): Promise<HomePage> => {
  const mountResult = await mount(<App />)
  return new HomePage(mountResult)
}
