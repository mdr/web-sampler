import '@testing-library/jest-dom/vitest'

// patch URL.createObjectURL as not supported in jsdom
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.URL.createObjectURL = () => 'blob:https://fake-audio'
