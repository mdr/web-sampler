import * as Sentry from '@sentry/react'
import ReactDOM from 'react-dom/client'
import 'typeface-roboto'

import { ProdApp } from './components/ProdApp.tsx'
import { TestApp } from './tests/playwright/TestApp.tsx'
import { getDocumentRoot } from './utils/domUtils.ts'

import './main.css'
import 'react-image-crop/dist/ReactCrop.css'
import 'react-toastify/dist/ReactToastify.css'

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://76652947461f95b8b088d6f7a87117bf@o4507312909123584.ingest.de.sentry.io/4507312913580112',
    environment: 'production',
  })
}

// Set to try the TestApp (used in component tests) when running with yarn dev
const useTestApp: boolean = import.meta.env.VITE_USE_TEST_APP === 'true'

ReactDOM.createRoot(getDocumentRoot()).render(useTestApp ? <TestApp /> : <ProdApp />)
