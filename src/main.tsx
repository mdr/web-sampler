import ReactDOM from 'react-dom/client'
import { ProdApp } from './components/ProdApp.tsx'
import { TestApp } from './tests/playwright/TestApp.tsx'
import { getDocumentRoot } from './utils/domUtils.ts'
import 'typeface-roboto'
import 'react-toastify/dist/ReactToastify.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './main.css'

// Set to try the TestApp (used in component tests) when running with yarn dev
const useTestApp: boolean = import.meta.env.VITE_USE_TEST_APP === 'true'

ReactDOM.createRoot(getDocumentRoot()).render(useTestApp ? <TestApp /> : <ProdApp />)
