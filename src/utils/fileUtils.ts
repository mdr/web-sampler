export const fileToUint8Array = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      resolve(new Uint8Array(arrayBuffer))
    }
    reader.onerror = () => {
      reject(new Error('Failed to read the file as an ArrayBuffer'))
    }
    reader.readAsArrayBuffer(file)
  })
}
