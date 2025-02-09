import { Link } from 'react-router-dom'

import { useImages } from '../../../sounds/library/imageHooks.ts'
import { getImageDisplayName, sortImagesByDisplayName } from '../../../types/Image.ts'
import { useImageIdParam } from '../../app/routeHooks.ts'
import { Routes } from '../../app/routes.ts'
import { NewImageButton } from '../NewImageButton.tsx'
import { ImagesSidebarTestIds } from './ImagesSidebarTestIds.ts'

export const ImagesSidebar = () => {
  const currentImageId = useImageIdParam()
  const images = sortImagesByDisplayName(useImages())
  return (
    <div data-testid={ImagesSidebarTestIds.sidebar} className="flex h-full flex-col">
      <div className="grow overflow-auto">
        <ul>
          {images.map((image) => (
            <li
              key={image.id}
              className={`group relative hover:bg-blue-100 ${image.id === currentImageId ? 'bg-blue-200' : ''}`}
            >
              <div className="flex items-center justify-between">
                <Link
                  to={Routes.editImage(image.id)}
                  className="block w-full p-2 focus:outline-hidden focus:ring-2 focus:ring-blue-300"
                  draggable={false}
                  data-testid={ImagesSidebarTestIds.imageName}
                >
                  {getImageDisplayName(image)}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center px-4 py-4">
        <NewImageButton testId={ImagesSidebarTestIds.newImageButton} />
      </div>
    </div>
  )
}
