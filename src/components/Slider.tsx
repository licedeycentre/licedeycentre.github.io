import React from 'react'
import { Link } from 'react-router-dom'
import {
  formatDateTimeString,
  formatDateTimeStringFull,
  filterFutureDateTimeStrings,
} from '../utils/dateFormat'
import type { ShowDates, PerformanceStatusType } from '../types/content'

interface HeroSlide {
  title: string
  description: string
  bgUrl?: string
  primaryButton?: { text: string; link: string }
  secondaryButton?: { text: string; link: string }
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface SliderProps {
  mode: 'hero' | 'gallery'
  slides?: HeroSlide[]
  images?: string[]
  title?: string
  description?: string
  meta?: string[]
  tickets?: string
  showDates?: ShowDates
  performanceStatus?: PerformanceStatusType
  className?: string
  breadcrumbs?: BreadcrumbItem[]
}

export const Slider: React.FC<SliderProps> = ({
  mode,
  slides = [],
  images = [],
  title,
  description,
  meta = [],
  tickets,
  showDates = [],
  performanceStatus,
  className = '',
  breadcrumbs = [],
}) => {
  const [index, setIndex] = React.useState(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [fadeOut, setFadeOut] = React.useState(false)

  // Определяем источник данных в зависимости от режима
  const dataSource = mode === 'hero' ? slides : images
  const total = dataSource.length

  // Fallback слайд для hero режима
  const fallbackSlide: HeroSlide = {
    title: 'Лицедей — Центр Современного Искусства',
    description: "Театр‑студия 'Балаганчик' во Владивостоке",
    bgUrl: '',
    primaryButton: { text: 'Связаться с нами', link: '/contacts' },
    secondaryButton: { text: 'О нас', link: '/about' },
  }

  const current = mode === 'hero' ? (slides.length > 0 ? slides[index] : fallbackSlide) : null

  // Унифицированная функция для создания backgroundImage
  const createBackgroundImage = (): string => {
    if (mode === 'hero') {
      if (current?.bgUrl) {
        return `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%), url(${current.bgUrl})`
      }
      return `var(--gradient-hero)`
    }

    // Gallery режим
    const currentImage = displayImages[index]
    if (currentImage) {
      // На первом слайде добавляем затемнение для лучшей читаемости текста
      // На остальных слайдах показываем изображение без затемнения
      if (index === 0) {
        return `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%), url(${currentImage})`
      } else {
        return `url(${currentImage})`
      }
    }

    // Заглушка для gallery режима
    return `var(--gradient-hero)`
  }

  // Унифицированная функция для получения контента
  const getContent = () => {
    if (mode === 'hero') {
      return {
        title: current?.title,
        description: current?.description,
        primaryButton: current?.primaryButton,
        secondaryButton: current?.secondaryButton,
      }
    }

    return {
      title,
      description,
      meta,
      tickets,
      showDates,
      performanceStatus,
    }
  }

  // Проверка наличия контента для отображения
  const hasContent = () => {
    const content = getContent()

    // В режиме gallery показываем контент только на первом слайде
    if (mode === 'gallery') {
      return (
        index === 0 &&
        !!(
          content.title ||
          content.description ||
          content.meta?.length ||
          content.tickets ||
          content.primaryButton ||
          content.secondaryButton ||
          content.showDates?.length
        )
      )
    }

    // В режиме hero показываем контент всегда
    return !!(
      content.title ||
      content.description ||
      content.meta?.length ||
      content.tickets ||
      content.primaryButton ||
      content.secondaryButton ||
      content.showDates?.length
    )
  }

  const prev = React.useCallback(() => {
    if (isTransitioning || total <= 1) {
      return
    }
    setIsTransitioning(true)
    setFadeOut(true)

    // Двухфазная анимация: fade-out → смена слайда → fade-in
    setTimeout(() => {
      setIndex(i => (i - 1 + total) % total)
      setFadeOut(false)
    }, 400) // Половина времени для fade-out

    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning, total])

  const next = React.useCallback(() => {
    if (isTransitioning || total <= 1) {
      return
    }
    setIsTransitioning(true)
    setFadeOut(true)

    // Двухфазная анимация: fade-out → смена слайда → fade-in
    setTimeout(() => {
      setIndex(i => (i + 1) % total)
      setFadeOut(false)
    }, 400) // Половина времени для fade-out

    setTimeout(() => setIsTransitioning(false), 800)
  }, [isTransitioning, total])

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prev()
      }
      if (e.key === 'ArrowRight') {
        next()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prev, next])

  // Добавляем поддержку touch-событий для мобильных устройств
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      return
    }
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      next()
    }
    if (isRightSwipe) {
      prev()
    }
  }

  // Рендер дат показов или статусных плашек для gallery режима
  const renderShowDatesOrStatus = () => {
    if (mode !== 'gallery' || !showDates || showDates.length === 0) {
      return renderStatusBadges()
    }

    const futureDates = filterFutureDateTimeStrings(showDates)

    // Для архивных спектаклей всегда показываем статусную плашку
    if (performanceStatus === 'archived') {
      return renderStatusBadges()
    }

    // Для активных спектаклей показываем даты или статус
    if (futureDates.length > 0) {
      return (
        <div className="hero-show-dates">
          <div className="hero-show-dates-list">
            {futureDates.map((dateTimeString, index) => (
              <div
                key={index}
                className="hero-show-date-item"
                title={formatDateTimeStringFull(dateTimeString)}
              >
                {formatDateTimeString(dateTimeString)}
              </div>
            ))}
          </div>
        </div>
      )
    } else {
      return renderStatusBadges()
    }
  }

  // Рендер статусных плашек для gallery режима
  const renderStatusBadges = () => {
    if (mode !== 'gallery') {
      return null
    }

    if (performanceStatus === 'archived') {
      return (
        <div className="hero-status-section">
          <div
            className="hero-status-badge hero-status-badge--archived"
            role="status"
            aria-label="Архивный спектакль"
          >
            Однажды на сцене
          </div>
        </div>
      )
    }

    if (performanceStatus === 'active') {
      return (
        <div className="hero-status-section">
          <div
            className="hero-status-badge hero-status-badge--upcoming"
            role="status"
            aria-label="Активный спектакль"
          >
            Грядущий показ
          </div>
        </div>
      )
    }

    return null
  }

  // Рендер контента слайдера
  const renderSliderContent = () => {
    const content = getContent()

    return (
      <div className="hero-content">
        <div className="hero-text">
          {content.title && <h1 className="hero-title">{content.title}</h1>}
          {content.description && <p className="hero-description">{content.description}</p>}

          {/* Мета-информация для gallery режима */}
          {mode === 'gallery' && content.meta && content.meta.length > 0 && (
            <div className="hero-meta">
              {content.meta.map((item, i) => (
                <span key={i} className="hero-meta-item">
                  {item}
                </span>
              ))}
            </div>
          )}

          {/* Кнопки */}
          <div className="hero-buttons">
            {/* Кнопки из hero режима */}
            {mode === 'hero' && (
              <>
                {content.primaryButton && (
                  <Link to={content.primaryButton.link} className="btn-primary">
                    {content.primaryButton.text}
                  </Link>
                )}
                {content.secondaryButton && (
                  <Link to={content.secondaryButton.link} className="btn-secondary">
                    {content.secondaryButton.text}
                  </Link>
                )}
              </>
            )}

            {/* Кнопка билетов для gallery режима */}
            {mode === 'gallery' &&
              tickets &&
              tickets !== 'hide' &&
              (() => {
                const futureDates = showDates ? filterFutureDateTimeStrings(showDates) : []
                const hasFutureDates = futureDates.length > 0

                const isFinished =
                  performanceStatus === 'active' &&
                  showDates &&
                  showDates.length > 0 &&
                  !hasFutureDates

                const ticketsUrl = tickets === 'show' ? '/contacts' : tickets

                if (performanceStatus !== 'archived' && !isFinished) {
                  return (
                    <a
                      href={ticketsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      Приобрести билеты
                    </a>
                  )
                }
                return null
              })()}
          </div>

          {/* Даты показов или статусные плашки для gallery режима */}
          {mode === 'gallery' && renderShowDatesOrStatus()}
        </div>
      </div>
    )
  }

  // Рендер breadcrumbs внутри слайдера
  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0 || mode !== 'gallery') {
      return null
    }

    return (
      <nav className="hero-breadcrumbs" aria-label="Хлебные крошки">
        <ol className="hero-breadcrumb-list">
          {breadcrumbs.map((item, index) => (
            <li key={index} className="hero-breadcrumb-item">
              {item.href ? (
                <Link to={item.href} className="hero-breadcrumb-link">
                  {item.label}
                </Link>
              ) : (
                <span className="hero-breadcrumb-current">{item.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="hero-breadcrumb-separator" aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 4L10 8L6 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  // Рендер навигации
  const renderNavigation = () => {
    const navigationTotal = mode === 'hero' ? total : displayImages.length
    if (navigationTotal <= 1) {
      return null
    }

    const ariaLabel =
      mode === 'hero' ? 'Навигация слайдера главной страницы' : 'Навигация слайдера спектакля'

    return (
      <div className="hero-nav" aria-label={ariaLabel}>
        <button
          type="button"
          className={`hero-arrow hero-arrow--left ${isTransitioning ? 'hero-arrow--hidden' : ''}`}
          onClick={prev}
          aria-label={mode === 'hero' ? 'Предыдущий слайд' : 'Предыдущее изображение'}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path
              d="M15.5 4.5L8 12l7.5 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          className={`hero-arrow hero-arrow--right ${isTransitioning ? 'hero-arrow--hidden' : ''}`}
          onClick={next}
          aria-label={mode === 'hero' ? 'Следующий слайд' : 'Следующее изображение'}
        >
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
            <path
              d="M8.5 4.5L16 12l-7.5 7.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    )
  }

  // Для gallery режима создаем заглушку если нет изображений
  const displayImages =
    mode === 'gallery' && images.length === 0
      ? [''] // Пустая строка для заглушки
      : images

  // Определяем CSS классы и aria-label
  const sectionClass = mode === 'hero' ? 'section hero' : 'performance-hero'
  const ariaLabel = mode === 'hero' ? 'Слайдер главной страницы 16:9' : 'Слайдер спектакля'

  return (
    <section className={`${sectionClass} ${className}`}>
      <div className="hero-art-wrap">
        <div
          className={`hero-art ${fadeOut ? 'hero-art--fade-out' : ''}`}
          role="img"
          aria-label={ariaLabel}
          style={{
            backgroundImage: createBackgroundImage(),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {renderBreadcrumbs()}
          {hasContent() && renderSliderContent()}
        </div>
        {renderNavigation()}
      </div>
    </section>
  )
}
