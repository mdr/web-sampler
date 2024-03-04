import '@testing-library/jest-dom/vitest'
import * as matchers from 'jest-extended'
import { expect } from 'vitest'

// Avoid issues with missing Blob.arrayBuffer:
import 'blob-polyfill'

// Extend vitest's expect with jest-extended's matchers:
expect.extend(matchers)
