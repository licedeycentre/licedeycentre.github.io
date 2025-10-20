import React from 'react'
import { useLocation } from 'react-router-dom'

// Скролл к началу страницы при смене маршрута
export const ScrollToTop: React.FC = () => {
  const location = useLocation()
  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  }, [location.pathname])
  return null
}
