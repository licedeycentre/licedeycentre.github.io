import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useMedia, useUILabels } from '../hooks/useContent'
import { siTelegram, siTiktok, siVk } from 'simple-icons'
import { scrollLock } from '../utils/scrollLock'
import { ChevronDown } from 'lucide-react'

// Компонент навигационной ссылки с активным состоянием
const NavLink: React.FC<{ to: string; children: React.ReactNode; className?: string }> = ({
  to,
  children,
  className = '',
}) => {
  const location = useLocation()
  const isActive = location.pathname === to

  return (
    <Link to={to} className={`nav-link ${isActive ? 'is-active' : ''} ${className}`}>
      {children}
    </Link>
  )
}

// Компонент выпадающего меню "О нас"
const AboutDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const location = useLocation()
  const closeTimeoutRef = React.useRef<number | null>(null)

  const isAboutActive = location.pathname.startsWith('/about')

  const dropdownRef = React.useRef<HTMLLIElement>(null)
  const chevronRef = React.useRef<HTMLDivElement>(null)

  // Закрытие при переходе на другую страницу
  React.useEffect(() => {
    setIsOpen(false)
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
  }, [location.pathname])

  // Очистка таймера при размонтировании
  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Слушаем события закрытия других дропдаунов
  React.useEffect(() => {
    const handleCloseOtherDropdowns = () => {
      setIsOpen(false)
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }
    }

    document.addEventListener('closeAboutDropdown', handleCloseOtherDropdowns)
    return () => document.removeEventListener('closeAboutDropdown', handleCloseOtherDropdowns)
  }, [])

  const handleChevronMouseEnter = () => {
    // Закрываем другие дропдауны
    document.dispatchEvent(new CustomEvent('closeServicesDropdown'))

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsOpen(true)
  }

  const handleChevronMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  const aboutSubpages = [
    { path: '/about/theater', label: 'Театр «Балаган»' },
    { path: '/about/studio', label: 'Театральная студия «Балаганчик»' },
    { path: '/about/inclusive', label: 'Инклюзивная театральная студия «Без границ»' },
    { path: '/about/summer-camp', label: 'Летний театральный лагерь' },
  ]

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        }
        // Фокус на первый элемент меню
        setTimeout(() => {
          const firstLink = dropdownRef.current?.querySelector('.dropdown-link')
          ;(firstLink as HTMLElement)?.focus()
        }, 10)
        break
      case 'Escape':
        if (isOpen) {
          event.preventDefault()
          setIsOpen(false)
        }
        break
    }
  }

  const handleMenuKeyDown = (event: React.KeyboardEvent, index: number) => {
    const items = dropdownRef.current?.querySelectorAll('.dropdown-link')
    if (!items) {
      return
    }

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        const nextIndex = Math.min(index + 1, items.length - 1)
        ;(items[nextIndex] as HTMLElement).focus()
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const prevIndex = Math.max(index - 1, 0)
        ;(items[prevIndex] as HTMLElement).focus()
        break
      }
      case 'Escape': {
        event.preventDefault()
        setIsOpen(false)
        // Возвращаем фокус на триггер
        const trigger = dropdownRef.current?.querySelector('.nav-link--dropdown') as HTMLElement
        trigger?.focus()
        break
      }
      case 'Tab': {
        // При Tab закрываем меню
        setIsOpen(false)
        break
      }
    }
  }

  return (
    <li className="nav-item nav-item--dropdown" ref={dropdownRef}>
      <Link
        to="/about"
        className={`nav-link nav-link--dropdown ${isAboutActive ? 'is-active' : ''}`}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="О нас"
      >
        О нас
        <div
          ref={chevronRef}
          onMouseEnter={handleChevronMouseEnter}
          onMouseLeave={handleChevronMouseLeave}
          className="chevron-container"
        >
          <ChevronDown size={14} className={`dropdown-icon ${isOpen ? 'is-open' : ''}`} />
        </div>
      </Link>

      {isOpen && (
        <ul
          className="dropdown-menu"
          role="menu"
          aria-label="Подразделы О нас"
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current)
              closeTimeoutRef.current = null
            }
          }}
          onMouseLeave={handleChevronMouseLeave}
        >
          {aboutSubpages.map((page, index) => {
            const isActive = location.pathname === page.path
            return (
              <li key={page.path} className="dropdown-item">
                <Link
                  to={page.path}
                  className={`dropdown-link ${isActive ? 'is-active' : ''}`}
                  role="menuitem"
                  onKeyDown={e => handleMenuKeyDown(e, index)}
                  onClick={() => setIsOpen(false)}
                >
                  {page.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

// Компонент выпадающего меню "Услуги"
const ServicesDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const location = useLocation()
  const closeTimeoutRef = React.useRef<number | null>(null)

  const isServicesActive = location.pathname.startsWith('/services')

  const dropdownRef = React.useRef<HTMLLIElement>(null)
  const chevronRef = React.useRef<HTMLDivElement>(null)

  // Закрытие при переходе на другую страницу
  React.useEffect(() => {
    setIsOpen(false)
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
    }
  }, [location.pathname])

  // Очистка таймера при размонтировании
  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Слушаем события закрытия других дропдаунов
  React.useEffect(() => {
    const handleCloseOtherDropdowns = () => {
      setIsOpen(false)
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
        closeTimeoutRef.current = null
      }
    }

    document.addEventListener('closeServicesDropdown', handleCloseOtherDropdowns)
    return () => document.removeEventListener('closeServicesDropdown', handleCloseOtherDropdowns)
  }, [])

  const handleChevronMouseEnter = () => {
    // Закрываем другие дропдауны
    document.dispatchEvent(new CustomEvent('closeAboutDropdown'))

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current)
      closeTimeoutRef.current = null
    }
    setIsOpen(true)
  }

  const handleChevronMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  const servicesSubpages = [
    { path: '/services/performances', label: 'Выступления на заказ' },
    { path: '/services/hall', label: 'Аренда зала' },
    { path: '/services/equipment', label: 'Аренда оборудования' },
  ]

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        }
        // Фокус на первый элемент меню
        setTimeout(() => {
          const firstLink = dropdownRef.current?.querySelector('.dropdown-link')
          ;(firstLink as HTMLElement)?.focus()
        }, 10)
        break
      case 'Escape':
        if (isOpen) {
          event.preventDefault()
          setIsOpen(false)
        }
        break
    }
  }

  const handleMenuKeyDown = (event: React.KeyboardEvent, index: number) => {
    const items = dropdownRef.current?.querySelectorAll('.dropdown-link')
    if (!items) {
      return
    }

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault()
        const nextIndex = Math.min(index + 1, items.length - 1)
        ;(items[nextIndex] as HTMLElement).focus()
        break
      }
      case 'ArrowUp': {
        event.preventDefault()
        const prevIndex = Math.max(index - 1, 0)
        ;(items[prevIndex] as HTMLElement).focus()
        break
      }
      case 'Escape': {
        event.preventDefault()
        setIsOpen(false)
        // Возвращаем фокус на триггер
        const trigger = dropdownRef.current?.querySelector('.nav-link--dropdown') as HTMLElement
        trigger?.focus()
        break
      }
      case 'Tab': {
        // При Tab закрываем меню
        setIsOpen(false)
        break
      }
    }
  }

  return (
    <li className="nav-item nav-item--dropdown" ref={dropdownRef}>
      <Link
        to="/services"
        className={`nav-link nav-link--dropdown ${isServicesActive ? 'is-active' : ''}`}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Услуги"
      >
        Услуги
        <div
          ref={chevronRef}
          onMouseEnter={handleChevronMouseEnter}
          onMouseLeave={handleChevronMouseLeave}
          className="chevron-container"
        >
          <ChevronDown size={14} className={`dropdown-icon ${isOpen ? 'is-open' : ''}`} />
        </div>
      </Link>

      {isOpen && (
        <ul
          className="dropdown-menu"
          role="menu"
          aria-label="Подразделы Услуги"
          onMouseEnter={() => {
            if (closeTimeoutRef.current) {
              clearTimeout(closeTimeoutRef.current)
              closeTimeoutRef.current = null
            }
          }}
          onMouseLeave={handleChevronMouseLeave}
        >
          {servicesSubpages.map((page, index) => {
            const isActive = location.pathname === page.path
            return (
              <li key={page.path} className="dropdown-item">
                <Link
                  to={page.path}
                  className={`dropdown-link ${isActive ? 'is-active' : ''}`}
                  role="menuitem"
                  onKeyDown={e => handleMenuKeyDown(e, index)}
                  onClick={() => setIsOpen(false)}
                >
                  {page.label}
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

// Компонент мобильного выпадающего меню "Услуги"
const MobileServicesDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const location = useLocation()

  const isServicesActive = location.pathname.startsWith('/services')

  const servicesSubpages = [
    { path: '/services/performances', label: 'Выступления на заказ' },
    { path: '/services/hall', label: 'Аренда зала' },
    { path: '/services/equipment', label: 'Аренда оборудования' },
  ]

  return (
    <li className="mobile-nav-item mobile-nav-item--dropdown">
      <button
        className={`mobile-nav-link mobile-nav-link--dropdown ${isServicesActive ? 'is-active' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        Услуги
        <ChevronDown size={16} className={`mobile-dropdown-icon ${isExpanded ? 'is-open' : ''}`} />
      </button>

      {isExpanded && (
        <ul className="mobile-dropdown-menu">
          {servicesSubpages.map(page => {
            return (
              <li key={page.path} className="mobile-nav-item mobile-nav-item--sub">
                <MobileNavLink to={page.path} onClick={onClose}>
                  {page.label}
                </MobileNavLink>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

// Компонент мобильного выпадающего меню "О нас"
const MobileAboutDropdown: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const location = useLocation()

  const isAboutActive = location.pathname.startsWith('/about')

  const aboutSubpages = [
    { path: '/about/theater', label: 'Театр «Балаган»' },
    { path: '/about/studio', label: 'Театральная студия «Балаганчик»' },
    { path: '/about/inclusive', label: 'Инклюзивная театральная студия «Без границ»' },
    { path: '/about/summer-camp', label: 'Летний театральный лагерь' },
  ]

  return (
    <li className="mobile-nav-item mobile-nav-item--dropdown">
      <button
        className={`mobile-nav-link mobile-nav-link--dropdown ${isAboutActive ? 'is-active' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
      >
        О нас
        <ChevronDown size={16} className={`mobile-dropdown-icon ${isExpanded ? 'is-open' : ''}`} />
      </button>

      {isExpanded && (
        <ul className="mobile-dropdown-menu">
          {aboutSubpages.map(page => {
            return (
              <li key={page.path} className="mobile-nav-item mobile-nav-item--sub">
                <MobileNavLink to={page.path} onClick={onClose}>
                  {page.label}
                </MobileNavLink>
              </li>
            )
          })}
        </ul>
      )}
    </li>
  )
}

// Компонент мобильной навигационной ссылки
const MobileNavLink: React.FC<{ to: string; children: React.ReactNode; onClick: () => void }> = ({
  to,
  children,
  onClick,
}) => {
  const location = useLocation()
  const isActive = location.pathname === to

  const handleClick = () => {
    onClick() // Закрываем меню
    scrollLock.unlock() // Разблокируем прокрутку
  }

  return (
    <Link
      to={to}
      className={`mobile-nav-link ${isActive ? 'is-active' : ''}`}
      onClick={handleClick}
    >
      {children}
    </Link>
  )
}

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const media = useMedia()
  const labels = useUILabels()
  const location = useLocation()

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    // Используем scrollLock вместо classList для блокировки прокрутки
    if (!isMobileMenuOpen) {
      scrollLock.lock()
    } else {
      scrollLock.unlock()
    }
  }

  // Используем media.logo если есть, иначе fallback на /images/logo.png
  const logoSrc = media.logo || '/images/logo.png'

  // Очистка при размонтировании и при переходах между страницами
  React.useEffect(() => {
    return () => {
      scrollLock.unlock()
    }
  }, [])

  // Автоматическое закрытие меню при переходе между страницами
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false)
      scrollLock.unlock()
    }
  }, [location.pathname, isMobileMenuOpen])

  return (
    <header className="site-header">
      {/* Единый уровень - брендинг, навигация, социальные сети и мобильное меню */}
      <div className="header-main">
        <div className="header-container">
          <div className="header-brand">
            <Link to="/" className="brand-link" aria-label="Лицедей — на главную">
              <div className="brand-logo">
                <img src={logoSrc} alt="Лицедей" className="logo-img" />
              </div>
              <div className="brand-text">
                <h1 className="brand-title">
                  <span className="title-main">ЛИЦЕДЕЙ</span>
                  <span className="title-sub">ЦЕНТР СОВРЕМЕННОГО ИСКУССТВА</span>
                </h1>
              </div>
            </Link>
          </div>

          {/* Центральная навигация для ПК */}
          <nav className="header-nav" aria-label={labels.ariaLabels.mainNavigation}>
            <ul className="nav-list">
              <li className="nav-item">
                <NavLink to="/">{labels.navigation.main}</NavLink>
              </li>
              <AboutDropdown />
              <ServicesDropdown />
              <li className="nav-item">
                <NavLink to="/contacts">{labels.navigation.contacts}</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/publications">{labels.navigation.publications}</NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/performances">{labels.navigation.performances}</NavLink>
              </li>
            </ul>
          </nav>

          <div className="header-right">
            <div className="header-socials">
              <a
                className="social-btn"
                href="https://t.me/licedeycentre"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={siTelegram.path} />
                </svg>
              </a>
              <a
                className="social-btn"
                href="https://www.tiktok.com/@licedeycentre"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={siTiktok.path} />
                </svg>
              </a>
              <a
                className="social-btn"
                href="https://vk.com/licedeycentre"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="VK"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={siVk.path} />
                </svg>
              </a>
            </div>

            <button
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Открыть меню"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          {/* Социальные сети для мобильных - по центру */}
          <div className="header-socials">
            <a
              className="social-btn"
              href="https://t.me/licedeycentre"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={siTelegram.path} />
              </svg>
            </a>
            <a
              className="social-btn"
              href="https://www.tiktok.com/@licedeycentre"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={siTiktok.path} />
              </svg>
            </a>
            <a
              className="social-btn"
              href="https://vk.com/licedeycentre"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="VK"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d={siVk.path} />
              </svg>
            </a>
          </div>

          {/* Мобильное меню - справа */}
          <button
            className="mobile-menu-toggle"
            onClick={toggleMobileMenu}
            aria-label="Открыть меню"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <div className="mobile-menu-content">
          <nav className="mobile-nav" aria-label="Мобильная навигация">
            <ul className="mobile-nav-list">
              <li className="mobile-nav-item">
                <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  {labels.navigation.main}
                </MobileNavLink>
              </li>
              <MobileAboutDropdown onClose={() => setIsMobileMenuOpen(false)} />
              <MobileServicesDropdown onClose={() => setIsMobileMenuOpen(false)} />
              <li className="mobile-nav-item">
                <MobileNavLink to="/contacts" onClick={() => setIsMobileMenuOpen(false)}>
                  {labels.navigation.contacts}
                </MobileNavLink>
              </li>
              <li className="mobile-nav-item">
                <MobileNavLink to="/publications" onClick={() => setIsMobileMenuOpen(false)}>
                  {labels.navigation.publications}
                </MobileNavLink>
              </li>
              <li className="mobile-nav-item">
                <MobileNavLink to="/performances" onClick={() => setIsMobileMenuOpen(false)}>
                  {labels.navigation.performances}
                </MobileNavLink>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
