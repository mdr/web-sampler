import type { test } from '@playwright/experimental-ct-react'

// workaround: https://github.com/microsoft/playwright/issues/27509#issuecomment-1754370996
export type MountResult = Awaited<ReturnType<Parameters<Parameters<typeof test>[1]>[0]['mount']>>
export type MountFunction = Parameters<Parameters<typeof test>[1]>[0]['mount']
