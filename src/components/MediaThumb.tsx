import React from 'react'

interface MediaThumbProps {
  src?: string
  alt: string
  containerClass: string
  placeholderClass: string
  children?: React.ReactNode
}

export const MediaThumb: React.FC<MediaThumbProps> = ({
  src,
  alt,
  containerClass,
  placeholderClass,
  children,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const showImage = !!src && !isError

  // Сброс состояния при изменении src
  React.useEffect(() => {
    setIsLoaded(false)
    setIsError(false)
  }, [src])

  return (
    <div className={containerClass} data-loaded={showImage && isLoaded ? 'true' : 'false'}>
      <div className={placeholderClass}></div>
      {showImage && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          loading="lazy"
        />
      )}
      {children}
    </div>
  )
}
