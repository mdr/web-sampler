import '@testing-library/jest-dom/vitest'
// Avoid issues with missing Blob.arrayBuffer:
import 'blob-polyfill'
import * as matchers from 'jest-extended'
import { expect } from 'vitest'

// Extend vitest's expect with jest-extended's matchers:
expect.extend(matchers)
