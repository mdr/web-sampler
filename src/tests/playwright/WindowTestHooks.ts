export interface WindowTestHooks {
  setVolume: (volume: number) => Promise<void>
  completeRecording: () => Promise<void>
  clockNext: () => void
  clockTick: (millis: number) => void
}
