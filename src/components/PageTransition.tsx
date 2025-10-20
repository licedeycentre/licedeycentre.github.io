import React from 'react'
import { useLocation } from 'react-router-dom'

interface PageTransitionProps {
  children: React.ReactNode
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation()
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [displayLocation, setDisplayLocation] = React.useState(location)

  React.useEffect(() => {
    if (location !== displayLocation) {
      setIsTransitioning(true)

      // Небольшая задержка для плавности
      const timer = setTimeout(() => {
        setDisplayLocation(location)
        setIsTransitioning(false)
      }, 150)

      return () => clearTimeout(timer)
    }
  }, [location, displayLocation])

  return (
    <div
      className={`page-transition ${isTransitioning ? 'page-transition--exiting' : 'page-transition--entering'}`}
    >
      {children}
    </div>
  )
}
