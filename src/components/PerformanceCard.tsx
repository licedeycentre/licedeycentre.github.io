import React from 'react'
import { Link } from 'react-router-dom'
import { MediaThumb } from './MediaThumb'
import {
  formatDateTimeStringShort,
  formatDateTimeStringFull,
  filterFutureDateTimeStrings,
  getLastPastDateTimeString,
  parseDateTimeString,
} from '../utils/dateFormat'
import { generatePerformanceId } from '../utils/slugify'
import type { Performance } from '../types/content'

interface PerformanceCardProps {
  performance: Performance
  showDates?: boolean
  maxDates?: number
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  performance,
  showDates = false,
  maxDates = 3,
}) => {
  // Мемоизируем вычисления для оптимизации
  const futureDates = React.useMemo(() => {
    const hasDates = performance.showDates && performance.showDates.length > 0
    return hasDates ? filterFutureDateTimeStrings(performance.showDates!) : []
  }, [performance.showDates])

  const displayDates = React.useMemo(() => {
    const total = futureDates.length
    const defaultMax = maxDates

    // Если дат 4 или меньше, показываем все
    if (total <= 4) {
      return futureDates
    }

    // Если дат больше 4, показываем только maxDates
    return futureDates.slice(0, defaultMax)
  }, [futureDates, maxDates])

  const remainingDates = React.useMemo(() => {
    const total = futureDates.length
    const shown = displayDates.length
    const remaining = total - shown

    // Показываем "+X ещё" только если:
    // 1. Есть скрытые даты (remaining > 0)
    // 2. И если показано меньше половины от общего количества дат
    // 3. Или если скрыто минимум 2 даты
    if (remaining > 0 && (shown < total / 2 || remaining >= 2)) {
      return remaining
    }
    return 0
  }, [futureDates.length, displayDates.length])

  return (
    <div className="performance-card">
      {/* Изображение - кликабельное */}
      <Link
        to={`/performances/${generatePerformanceId(performance.title)}`}
        className="performance-card-bg"
      >
        <MediaThumb
          src={performance.slider?.[0] || ''}
          alt={performance.title}
          containerClass="performance-image"
          placeholderClass="performance-placeholder"
        />
        {/* Градиент поверх изображения */}
        <div className="performance-card-gradient"></div>
      </Link>

      {/* Метабейджи поверх изображения - выделяемые, но не кликабельные */}
      <div className="card-meta-corner">
        {performance.duration && (
          <span
            className="card-meta-badge card-meta-badge--selectable"
            title="Продолжительность спектакля"
            onClick={e => e.stopPropagation()}
          >
            {performance.duration}
          </span>
        )}
        {performance.ageGroup && (
          <span
            className="card-meta-badge card-meta-badge--selectable"
            title="Возрастные ограничения"
            onClick={e => e.stopPropagation()}
          >
            {performance.ageGroup}
          </span>
        )}
      </div>

      {/* Заголовок - кликабельный */}
      <div className="card-title-area">
        <Link
          to={`/performances/${generatePerformanceId(performance.title)}`}
          className="card-title-link"
        >
          <h3 className="card-title">{performance.title}</h3>
        </Link>
      </div>

      {/* Контент (даты и кнопка) - не кликабельный */}
      <div className="card-content-area">
        {/* Даты показов - только для активных спектаклей */}
        {showDates && futureDates.length > 0 && performance.status !== 'archived' && (
          <div className="performance-dates">
            {displayDates.map((dateTimeString, index) => (
              <div
                key={index}
                className="performance-date"
                title={formatDateTimeStringFull(dateTimeString)}
              >
                {formatDateTimeStringShort(dateTimeString)}
              </div>
            ))}
            {remainingDates > 0 && (
              <div className="performance-date-more">+{remainingDates} ещё</div>
            )}
          </div>
        )}

        {/* Плашки статуса */}
        {showDates && (
          <>
            {/* Архивный спектакль - всегда показываем плашку независимо от дат */}
            {performance.status === 'archived' && (
              <div
                className="performance-status-badge performance-status-badge--archived"
                role="status"
                aria-label="Архивный спектакль"
              >
                Однажды на сцене
              </div>
            )}

            {/* Активные спектакли без будущих дат */}
            {performance.status === 'active' && futureDates.length === 0 && (
              <>
                {/* Активный спектакль без дат */}
                {(!performance.showDates || performance.showDates.length === 0) && (
                  <div
                    className="performance-status-badge performance-status-badge--upcoming"
                    role="status"
                    aria-label="Активный спектакль без дат показов"
                  >
                    Грядущий показ
                  </div>
                )}

                {/* Активный спектакль с прошедшими датами */}
                {performance.showDates && performance.showDates.length > 0 && (
                  <div
                    className="performance-status-badge performance-status-badge--completed"
                    role="status"
                    aria-label="Активный спектакль, показ завершен"
                  >
                    Показ завершен
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Кнопка билеты - отдельная ссылка */}
        {(() => {
          // Определяем, показывать ли кнопку
          const shouldShowTickets = performance.tickets && performance.tickets !== 'hide'

          // Определяем URL
          const getTicketsUrl = () => {
            if (!performance.tickets || performance.tickets === 'hide') return null
            if (performance.tickets === 'show') return '/contacts'
            return performance.tickets // URL
          }

          const ticketsUrl = getTicketsUrl()

          return shouldShowTickets &&
            performance.status !== 'archived' &&
            !(performance.status === 'active' &&
              performance.showDates &&
              performance.showDates.length > 0 &&
              futureDates.length === 0) &&
            ticketsUrl && (
              <div className="card-tickets-button">
                {ticketsUrl.startsWith('http') ? (
                  <a
                    href={ticketsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Приобрести билеты
                  </a>
                ) : (
                  <Link to={ticketsUrl} className="btn btn-primary">
                    Приобрести билеты
                  </Link>
                )}
              </div>
            )
        })()}
      </div>
    </div>
  )
}
