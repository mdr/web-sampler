import { App } from '../../components/App.tsx'
import { MockAudioRecorder } from './mocks/MockAudioRecorder.ts'
import { FC } from 'react'
import { default as FakeTimers } from '@sinonjs/fake-timers'
import useDidMount from 'beautiful-react-hooks/useDidMount'
import { DefaultWindowTestHooks } from './testApp/DefaultWindowTestHooks.tsx'
import { LazyAudioContextProvider } from '../../audioRecorder/AudioContextProvider.ts'
import { DefaultAudioPlayer } from '../../audioPlayer/DefaultAudioPlayer.ts'
import { castPartial, MockAudioElement } from './mocks/MockAudioElement.ts'
import { SoundLibrary } from '../../sounds/SoundLibrary.ts'
import { SoundStore } from '../../sounds/SoundStore.ts'
import { AppDb } from '../../sounds/AppDb.ts'

export interface TestAppProps {}

export const TestApp: FC<TestAppProps> = () => {
  const audioRecorder = new MockAudioRecorder()
  const audioContextProvider = new LazyAudioContextProvider()
  const mockAudioElement = new MockAudioElement()
  const audioPlayer = new DefaultAudioPlayer(castPartial<HTMLAudioElement>(mockAudioElement))
  const soundLibrary = new SoundLibrary(new SoundStore(new AppDb()))

  useDidMount(() => {
    const clock = FakeTimers.install()
    window.testHooks = new DefaultWindowTestHooks(audioRecorder, mockAudioElement, clock, soundLibrary)
    return () => clock.uninstall()
  })
  return (
    <App
      audioRecorder={audioRecorder}
      audioContextProvider={audioContextProvider}
      audioPlayer={audioPlayer}
      soundLibrary={soundLibrary}
    />
  )
}
