import React from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

interface ImageGalleryProps {
  images: string[]
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = React.useState(false)

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
  }

  // Преобразуем массив строк в формат, ожидаемый Lightbox
  const lightboxSlides = images.map(src => ({ src }))

  if (!images || images.length === 0) {
    return null
  }

  return (
    <>
      <div className="image-gallery">
        {images.map((image, index) => (
          <div
            key={index}
            className="gallery-grid-item"
            onClick={() => openLightbox(index)}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                openLightbox(index)
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Открыть изображение ${index + 1} в полноэкранном режиме`}
          >
            <img
              src={image}
              alt={`Изображение ${index + 1} из ${images.length}`}
              className="gallery-grid-image"
              loading="lazy"
              onError={e => {
                e.currentTarget.src =
                  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjhmOGY4Ii8+CjxwYXRoIGQ9Ik0xMDAgNzVMMTI1IDEwMEgxMTJWMTI1SDg4VjEwMEg3NUwxMDAgNzVaIiBmaWxsPSIjY2NjIi8+Cjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LXNpemU9IjE0Ij7Qn9C+0LrQsNC30YvQstCw0L3QvdC+0LU8L3RleHQ+Cjwvc3ZnPg=='
              }}
            />
          </div>
        ))}
      </div>

      <Lightbox
        open={isLightboxOpen}
        close={closeLightbox}
        slides={lightboxSlides}
        index={currentIndex}
        on={{
          view: ({ index }) => setCurrentIndex(index),
        }}
      />
    </>
  )
}
