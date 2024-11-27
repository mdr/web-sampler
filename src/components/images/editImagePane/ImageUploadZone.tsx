import clsx from 'clsx'
import { ClipboardEvent, ClipboardEventHandler, useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'

import { useImageActions } from '../../../sounds/library/soundHooks.ts'
import { ImageId } from '../../../types/Image.ts'
import { fileToUint8Array } from '../../../utils/fileUtils.ts'
import { ImageBytes, MediaType } from '../../../utils/types/brandedTypes.ts'
import { fireAndForget } from '../../../utils/utils.ts'
import { EditImagePaneTestIds } from './EditImagePaneTestIds.ts'

export interface ImageUploadZoneProps {
  imageId: ImageId
}

export const ImageUploadZone = ({ imageId }: ImageUploadZoneProps) => {
  const imageActions = useImageActions()

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) {
        return
      }
      if (acceptedFiles.length > 1) {
        alert('Only one image file is allowed.')
        return
      }
      const file = acceptedFiles[0]
      fireAndForget(async () => {
        const fileData = await fileToUint8Array(file)
        imageActions.setImageData(imageId, ImageBytes(fileData), MediaType(file.type))
      })
    },
    [imageActions, imageId],
  )

  const onDropRejected = (fileRejections: FileRejection[]) => {
    console.warn('Rejected files:', fileRejections)
    alert('Only image files are allowed.')
  }

  const onPaste: ClipboardEventHandler = useCallback(
    (event: ClipboardEvent) => {
      const items = Array.from(event.clipboardData.items)
      const imageItem = items.find((item) => item.type.startsWith('image/'))
      if (imageItem !== undefined) {
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
      data-testid={EditImagePaneTestIds.dropzone}
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
