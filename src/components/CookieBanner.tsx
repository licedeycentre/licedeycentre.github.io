import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUILabels } from '../hooks/useContent'

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const labels = useUILabels()

  useEffect(() => {
    // Проверяем, было ли уже дано согласие
    try {
      const consent = localStorage.getItem('cookieConsent')
      if (!consent) {
        setIsVisible(true)
      }
    } catch {
      // Если localStorage недоступен, показываем баннер
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem('cookieConsent', 'accepted')
      setIsVisible(false)
    } catch {
      // Если localStorage недоступен, просто скрываем баннер
      setIsVisible(false)
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="cookie-banner">
      <div className="cookie-banner__content">
        <div className="cookie-banner__text">
          <p>
            {labels.cookies.description}{' '}
            <Link to="/privacy-policy" className="cookie-banner__link">
              {labels.cookies.privacyPolicy}
            </Link>
            .
          </p>
        </div>
        <button className="btn-primary" onClick={handleAccept} type="button">
          {labels.cookies.accept}
        </button>
      </div>
    </div>
  )
}

export default CookieBanner
