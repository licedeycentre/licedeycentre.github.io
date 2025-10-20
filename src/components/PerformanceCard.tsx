import React from 'react'
import { Link } from 'react-router-dom'
import { MediaThumb } from './MediaThumb'
import {
  formatShowDateShort,
  filterFutureShowDates,
  getLastPastShowDate,
  formatLastShowDate,
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
    return hasDates ? filterFutureShowDates(performance.showDates!) : []
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
          src={performance.image}
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
        {/* Даты показов */}
        {showDates && futureDates.length > 0 && (
          <div className="performance-dates">
            {displayDates.map((showDate, index) => (
              <div key={index} className="performance-date">
                {formatShowDateShort(showDate.date, showDate.time)}
              </div>
            ))}
            {remainingDates > 0 && (
              <div className="performance-date-more">+{remainingDates} ещё</div>
            )}

            {/* Плашка "Планируется в сезоне" для planned спектаклей с датами */}
            {performance.status === 'planned' && (
              <div
                className="performance-status-badge performance-status-badge--planned"
                role="status"
                aria-label="Спектакль планируется к показу в текущем сезоне"
              >
                Планируется в сезоне
              </div>
            )}
          </div>
        )}

        {/* Плашки статуса для спектаклей без будущих дат */}
        {showDates && futureDates.length === 0 && (
          <>
            {/* Архивный спектакль - показываем последнюю прошедшую дату */}
            {performance.status === 'archived' &&
              performance.showDates &&
              performance.showDates.length > 0 &&
              (() => {
                const lastPastDate = getLastPastShowDate(performance.showDates)
                if (lastPastDate) {
                  return (
                    <div
                      className="performance-status-badge performance-status-badge--archived"
                      role="status"
                      aria-label={`Архивный спектакль. Последний показ: ${formatLastShowDate(lastPastDate.date)}`}
                    >
                      Последний показ: {formatLastShowDate(lastPastDate.date)}
                    </div>
                  )
                } else {
                  // Все даты в будущем - показываем заглушку
                  return (
                    <div
                      className="performance-status-badge performance-status-badge--archived"
                      role="status"
                      aria-label="Архивный спектакль без прошедших дат показов"
                    >
                      Давненько было...
                    </div>
                  )
                }
              })()}

            {/* Архивный спектакль без дат */}
            {performance.status === 'archived' &&
              (!performance.showDates || performance.showDates.length === 0) && (
                <div
                  className="performance-status-badge performance-status-badge--archived"
                  role="status"
                  aria-label="Архивный спектакль без дат показов"
                >
                  Давненько было...
                </div>
              )}

            {/* Текущий спектакль, но даты прошли */}
            {performance.status === 'current' && (
              <div
                className="performance-status-badge performance-status-badge--completed"
                role="status"
                aria-label="Текущий спектакль, показ завершен"
              >
                Показ завершен
              </div>
            )}

            {/* Планируемый спектакль без дат */}
            {performance.status === 'development' && (
              <div
                className="performance-status-badge performance-status-badge--ripening"
                role="status"
                aria-label="Спектакль в разработке, созревает к показу"
              >
                Созревает к показу
              </div>
            )}

            {/* Планируется в сезоне */}
            {performance.status === 'planned' && (
              <div
                className="performance-status-badge performance-status-badge--planned"
                role="status"
                aria-label="Спектакль планируется к показу в текущем сезоне"
              >
                Планируется в сезоне
              </div>
            )}
          </>
        )}

        {/* Кнопка билеты - отдельная ссылка */}
        {performance.showTicketsButton === true &&
          !(performance.status === 'current' && futureDates.length === 0) && (
            <div className="card-tickets-button">
              {performance.ticketsUrl ? (
                <a
                  href={performance.ticketsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Приобрести билеты
                </a>
              ) : (
                <Link to="/contacts" className="btn btn-primary">
                  Приобрести билеты
                </Link>
              )}
            </div>
          )}
      </div>
    </div>
  )
}
