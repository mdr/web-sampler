import useDidMount from 'beautiful-react-hooks/useDidMount'
import ConditionalWrap from 'conditional-wrap'
import React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import { AppConfig } from '../../config/AppConfig.ts'
import { unawaited } from '../../utils/utils.ts'
import { AlreadyOpenInAnotherTabPage } from '../misc/AlreadyOpenInAnotherTabPage.tsx'
import { ErrorFallback } from '../misc/ErrorFallback.tsx'
import { ExclusiveTab } from '../misc/ExclusiveTab.tsx'
import { AllProviders } from './AllProviders.tsx'
import { router } from './router.tsx'

export interface AppProps {
  config: AppConfig
}

export const App = ({ config }: AppProps) => {
  useDidMount(() => unawaited(config.storageManager.checkIfStorageIsPersistent()))
  return (
    <ConditionalWrap condition={true} wrap={(children) => <React.StrictMode>{children}</React.StrictMode>}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <ExclusiveTab fallback={<AlreadyOpenInAnotherTabPage />}>
          <ToastContainer position="top-center" hideProgressBar closeOnClick closeButton={false} />
          <AllProviders config={config}>
            <RouterProvider router={router} />
          </AllProviders>
        </ExclusiveTab>
      </ErrorBoundary>
    </ConditionalWrap>
  )
}
