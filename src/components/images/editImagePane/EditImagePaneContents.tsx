import { ImageId } from '../../../types/Image.ts'

export interface EditImagePaneContentsProps {
  imageId: ImageId
}

export const EditImagePaneContents = (_: EditImagePaneContentsProps) => {
  // const soundActions = useSoundActions()
  // const image = useImage(imageId)
  return <div className="flex flex-col space-y-4 px-4 pt-4"></div>
  //     <SoundboardNameTextField name={image.name} setName={setSoundboardName} />
  //     <div className="flex justify-center">
  //       <AddSoundButton soundboardId={soundboardId} />
  //     </div>
  //     <SoundTileGrid soundboardId={soundboardId} />
  //   </div>
  // )
}
