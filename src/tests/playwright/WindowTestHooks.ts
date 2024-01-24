export interface WindowTestHooks {
  setVolume: (volume: number) => Promise<void>
  completeRecording: () => Promise<void>
}
