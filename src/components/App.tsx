/* eslint-disable react/jsx-key */
import React, { PropsWithChildren } from 'react'
import { RouterProvider } from 'react-router-dom'
import { AudioRecorderContext } from '../audioRecorder/AudioRecorderContext.ts'
import { ToastContainer } from 'react-toastify'
import { SoundLibraryContext } from '../sounds/library/SoundLibraryContext.ts'
import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from './misc/ErrorFallback.tsx'
import { router } from './router.tsx'
import { AudioPlayerContext } from '../audioPlayer/AudioPlayerContext.ts'
import { StorageManagerContext } from '../storage/StorageManagerContext.ts'
import { AppConfig } from '../config/AppConfig.ts'
import reactArrayToTree from 'react-array-to-tree'
import { ExclusiveTab } from './misc/ExclusiveTab.tsx'
import { AlreadyOpenInAnotherTabPage } from './misc/AlreadyOpenInAnotherTabPage.tsx'
import { AudioOperationsContext } from '../audioOperations/AudioOperationsContext.ts'
import useDidMount from 'beautiful-react-hooks/useDidMount'
import { unawaited } from '../utils/utils.ts'
import ConditionalWrap from 'conditional-wrap'

export interface AppProps {
  config: AppConfig
}

const nestProviders = (config: AppConfig): React.FC<PropsWithChildren> => {
  const { audioRecorder, audioPlayer, soundLibrary, storageManager, audioOperations } = config
  return reactArrayToTree([
    <AudioRecorderContext.Provider value={audioRecorder} />,
    <AudioPlayerContext.Provider value={audioPlayer} />,
    <AudioOperationsContext.Provider value={audioOperations} />,
    <SoundLibraryContext.Provider value={soundLibrary} />,
    <StorageManagerContext.Provider value={storageManager} />,
  ]) as React.FC<PropsWithChildren>
}

export const App = ({ config }: AppProps) => {
  const AllProviders = nestProviders(config)
  useDidMount(() => {
    unawaited(config.storageManager.checkIfStorageIsPersistent())
  })
  return (
    <ConditionalWrap condition={false} wrap={(children) => <React.StrictMode>{children}</React.StrictMode>}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <ExclusiveTab fallback={<AlreadyOpenInAnotherTabPage />}>
          <ToastContainer position="top-center" hideProgressBar closeOnClick closeButton={false} />
          <AllProviders>
            <RouterProvider router={router} />
          </AllProviders>
        </ExclusiveTab>
      </ErrorBoundary>
    </ConditionalWrap>
  )
}
