import React from 'react'
import { Link } from 'react-router-dom'
import {
  formatShowDate,
  filterFutureShowDates,
  getLastPastShowDate,
  formatLastShowDate,
} from '../utils/dateFormat'
import type { ShowDate, PerformanceStatusType } from '../types/content'

interface HeroSlide {
  title: string
  description: string
  bgUrl?: string
  bgColor?: string
  buttons?: Array<{
    text: string
    href: string
    primary: boolean
  }>
}

interface SliderProps {
  mode: 'hero' | 'gallery'
  slides?: HeroSlide[]
  images?: string[]
  title?: string
  description?: string
  meta?: string[]
  ticketsUrl?: string
  showDates?: ShowDate[]
  performanceStatus?: PerformanceStatusType
  showTicketsButton?: boolean
  className?: string
}

export const Slider: React.FC<SliderProps> = ({
  mode,
  slides = [],
  images = [],
  title,
  description,
  meta = [],
  ticketsUrl,
  showDates = [],
  performanceStatus,
  showTicketsButton,
  className = '',
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
    buttons: [
      { text: 'Связаться с нами', href: '/contacts', primary: true },
      { text: 'О нас', href: '/about', primary: false },
    ],
  }

  const current = mode === 'hero' ? (slides.length > 0 ? slides[index] : fallbackSlide) : null

  // Унифицированная функция для создания backgroundImage
  const createBackgroundImage = (): string => {
    if (mode === 'hero') {
      if (current?.bgUrl) {
        return `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%), url(${current.bgUrl})`
      }
      if (current?.bgColor) {
        return `linear-gradient(135deg, ${current.bgColor} 0%, ${current.bgColor}dd 100%)`
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
        buttons: current?.buttons,
      }
    }

    return {
      title,
      description,
      meta,
      ticketsUrl,
      showDates,
      performanceStatus,
      showTicketsButton,
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
          content.ticketsUrl ||
          content.buttons?.length ||
          content.showDates?.length
        )
      )
    }

    // В режиме hero показываем контент всегда
    return !!(
      content.title ||
      content.description ||
      content.meta?.length ||
      content.ticketsUrl ||
      content.buttons?.length ||
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

    const futureDates = filterFutureShowDates(showDates)

    if (futureDates.length > 0) {
      return (
        <div className="hero-show-dates">
          <div className="hero-show-dates-list">
            {futureDates.map((showDate, index) => (
              <div key={index} className="hero-show-date-item">
                {formatShowDate(showDate.date, showDate.time)}
              </div>
            ))}
          </div>

          {/* Плашка "Планируется в сезоне" для planned спектаклей с датами */}
          {performanceStatus === 'planned' && (
            <div
              className="hero-status-badge hero-status-badge--planned"
              role="status"
              aria-label="Спектакль планируется к показу в текущем сезоне"
            >
              Планируется в сезоне
            </div>
          )}
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
      if (showDates && showDates.length > 0) {
        const lastPastDate = getLastPastShowDate(showDates)
        if (lastPastDate) {
          return (
            <div className="hero-status-section">
              <div
                className="hero-status-badge hero-status-badge--archived"
                role="status"
                aria-label={`Архивный спектакль. Последний показ: ${formatLastShowDate(lastPastDate.date)}`}
              >
                {formatLastShowDate(lastPastDate.date)}
              </div>
            </div>
          )
        } else {
          // Все даты в будущем - показываем заглушку
          return (
            <div className="hero-status-section">
              <div
                className="hero-status-badge hero-status-badge--archived"
                role="status"
                aria-label="Архивный спектакль без прошедших дат показов"
              >
                Давненько было...
              </div>
            </div>
          )
        }
      } else {
        return (
          <div className="hero-status-section">
            <div
              className="hero-status-badge hero-status-badge--archived"
              role="status"
              aria-label="Архивный спектакль без дат показов"
            >
              Давненько было...
            </div>
          </div>
        )
      }
    }

    if (performanceStatus === 'current') {
      return (
        <div className="hero-status-section">
          <div
            className="hero-status-badge hero-status-badge--completed"
            role="status"
            aria-label="Текущий спектакль, показ завершен"
          >
            Показ завершен
          </div>
        </div>
      )
    }

    if (performanceStatus === 'development') {
      return (
        <div className="hero-status-section">
          <div
            className="hero-status-badge hero-status-badge--ripening"
            role="status"
            aria-label="Спектакль в разработке, созревает к показу"
          >
            Созревает к показу
          </div>
        </div>
      )
    }

    if (performanceStatus === 'planned') {
      return (
        <div className="hero-status-section">
          <div
            className="hero-status-badge hero-status-badge--planned"
            role="status"
            aria-label="Спектакль планируется к показу в текущем сезоне"
          >
            Планируется в сезоне
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
            {mode === 'hero' &&
              content.buttons?.map((button, i) => (
                <Link
                  key={i}
                  to={button.href}
                  className={button.primary ? 'btn-primary' : 'btn-secondary'}
                >
                  {button.text}
                </Link>
              ))}

            {/* Кнопка билетов для gallery режима */}
            {mode === 'gallery' &&
              content.ticketsUrl &&
              (() => {
                const futureDates = showDates ? filterFutureShowDates(showDates) : []
                const hasFutureDates = futureDates.length > 0
                const isCurrentWithoutDates = performanceStatus === 'current' && !hasFutureDates

                // Проверяем, нужно ли показывать кнопку (только если явно указано true)
                const shouldShowTickets = content.showTicketsButton === true

                if (shouldShowTickets && !isCurrentWithoutDates) {
                  return (
                    <a
                      href={content.ticketsUrl}
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
          {hasContent() && renderSliderContent()}
        </div>
        {renderNavigation()}
      </div>
    </section>
  )
}
