import clsx from 'clsx'
import { ClipboardEvent, ClipboardEventHandler, useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'

export const ImageUploadZone = () => {
  const onDrop = (acceptedFiles: File[]) => {
    console.log(acceptedFiles)
  }

  const onDropRejected = (fileRejections: FileRejection[]) => {
    console.warn('Rejected files:', fileRejections)
    alert('Only image files are allowed.')
  }

  const onPaste: ClipboardEventHandler = useCallback(
    (event: ClipboardEvent) => {
      const items = event.clipboardData.items
      const imageItem = Array.from(items).find((item) => item.type.startsWith('image/'))
      if (imageItem) {
        const file = imageItem.getAsFile() ?? undefined
        if (file) {
          onDrop([file])
        }
      }
    },
    [onDrop],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { 'image/*': [] },
    maxFiles: 1,
    multiple: false,
  })

  return (
    <div
      onPaste={onPaste}
      {...getRootProps()}
      className={clsx(
        'border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors',
        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-100 hover:bg-gray-200',
      )}
    >
      <input {...getInputProps()} />
      <p className={clsx(isDragActive ? 'text-blue-500' : 'text-gray-500')}>
        {isDragActive ? 'Drop an image here' : 'Click to choose an image to upload (or drop)'}
      </p>
    </div>
  )
}
