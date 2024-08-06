import { create } from 'zustand'

interface SoundTileGridState {
  isShowingDialog: boolean
  setShowingDialog: (isShowingDialog: boolean) => void
}

export const useSoundTileGridStore = create<SoundTileGridState>()((set) => ({
  isShowingDialog: false,
  setShowingDialog: (isShowingDialog: boolean) => set({ isShowingDialog }),
}))
