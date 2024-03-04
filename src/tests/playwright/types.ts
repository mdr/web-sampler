import type { MountResult } from '@playwright/experimental-ct-react'
import React from 'react'

export type MountFunction = (component: React.JSX.Element) => Promise<MountResult>
