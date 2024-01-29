import audioUrl from '../../../assets/captured-audio-example.webm'

export const fetchBlob = async (): Promise<Blob> => {
  const response = await fetch(audioUrl)
  if (!response.ok) {
    throw new Error('Audio file could not be loaded')
  }
  return await response.blob()
}
