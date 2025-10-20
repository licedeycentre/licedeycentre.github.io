import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)

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
            Мы используем cookies, Яндекс.Метрику и другие средства аналитики для улучшения работы
            сайта. Cookies сохраняют информацию о взаимодействии с сайтом, включая IP-адрес, браузер
            и ОС. Данные обрабатываются на территории РФ в соответствии с законодательством.
            Продолжая пользоваться сайтом, вы соглашаетесь с использованием cookies и{' '}
            <Link to="/privacy-policy" className="cookie-banner__link">
              политикой конфиденциальности
            </Link>
            .
          </p>
        </div>
        <button className="btn-primary" onClick={handleAccept} type="button">
          Принять
        </button>
      </div>
    </div>
  )
}

export default CookieBanner
