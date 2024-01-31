export interface WindowTestHooks {
  setVolume: (volume: number) => Promise<void>
  clockNext: () => void
  clockTick: (millis: number) => void
}
