declare global {
  interface Window {
    setVolume: (volume: number) => Promise<void>
  }
}

export {}
