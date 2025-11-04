import React from 'react'
import { Link } from 'react-router-dom'
import { ImageGallery } from './ImageGallery'
import { VideoPlayer } from './VideoPlayer'
import { Slider, BreadcrumbItem } from './Slider'
import { PerformanceInfoCard } from './PerformanceInfoCard'
import { processHtmlContent } from '../utils/htmlProcessor'
import { formatDate } from '../utils/dateFormat'
import { Download, Eye } from 'lucide-react'
import { getDocumentIcon, getDocumentColor, getDocumentPreviewUrl } from '../utils/documentIcons'
import { BaseContentPage, Performance, Cast, UILabels } from '../types/content'

interface ContentPageRendererProps {
  page: BaseContentPage
  labels?: UILabels

  // Специфичные элементы для публикаций
  header?: {
    title: string
    date?: string
    tags?: string[]
    image?: string
  }
  buttons?: string[] // Кнопки действия для публикаций

  // Специфичные элементы для спектаклей
  slider?: {
    images: string[]
    title: string
    description: string
    showDates?: string[]
    status?: 'active' | 'archived'
    tickets?: string
  }
  performanceInfo?: Performance // Для PerformanceInfoCard
  cast?: Cast // Действующие лица
  detailsContent?: string // Для отдельного рендеринга details перед контентом
  showContactButton?: boolean // Показывать ли кнопку связаться
  breadcrumbs?: BreadcrumbItem[] // Breadcrumbs для слайдера
}

const ContentPageRenderer: React.FC<ContentPageRendererProps> = ({
  page,
  labels,
  header,
  buttons,
  slider,
  performanceInfo,
  cast,
  detailsContent,
  showContactButton = true,
  breadcrumbs = [],
}) => {
  const [showArchivedActors, setShowArchivedActors] = React.useState(false)

  return (
    <>
      {/* 1. Slider (для спектаклей) */}
      {slider && (
        <Slider
          mode="gallery"
          images={slider.images}
          title={slider.title}
          description={slider.description}
          showDates={slider.showDates}
          performanceStatus={slider.status}
          tickets={slider.tickets}
          breadcrumbs={breadcrumbs}
        />
      )}

      {/* 2. Header с датой/тегами/обложкой (для публикаций) */}
      {header && (
        <div className="content-card">
          <header className="detail-header">
            {(header.date || (header.tags && header.tags.length > 0)) && (
              <div className="detail-meta">
                {header.date && <span>{formatDate(header.date)}</span>}
                {header.tags && header.tags.length > 0 && <span>{header.tags.join(' • ')}</span>}
              </div>
            )}
            <h1>{header.title}</h1>
          </header>

          {/* Обложка публикации */}
          {header.image && (
            <div className="publication-cover">
              <img src={header.image} alt={header.title} loading="lazy" />
            </div>
          )}
        </div>
      )}

      {/* 3. PerformanceInfo (для спектаклей) */}
      {performanceInfo && <PerformanceInfoCard performance={performanceInfo} />}

      {/* 4. Details content (для спектаклей) */}
      {detailsContent && (
        <div className="content-card">
          <div className="readable-content">{processHtmlContent(detailsContent)}</div>
        </div>
      )}

      {/* 5. Cast (действующие лица для спектаклей) */}
      {cast &&
        Object.keys(cast).length > 0 &&
        (() => {
          // Проверяем, есть ли архивные актеры
          const hasArchivedActors = Object.values(cast).some(actors =>
            actors.some(actor => actor.startsWith('*'))
          )

          return (
            <div className="content-card">
              <div className="readable-content">
                <h2>Действующие лица и исполнители</h2>
                <div className="cast-list">
                  {Object.entries(cast).map(([role, actors], index) => (
                    <div key={index} className="cast-member">
                      <div className="cast-role">{role}</div>
                      <div className="cast-actors">
                        {actors.map((actor, actorIndex) => {
                          const isArchived = actor.startsWith('*')
                          const actorName = isArchived ? actor.slice(1) : actor

                          // Если архивные актеры скрыты, не показываем их
                          if (isArchived && !showArchivedActors) {
                            return null
                          }

                          return (
                            <div
                              key={actorIndex}
                              className={`cast-actor ${isArchived ? 'cast-actor-archived' : ''}`}
                            >
                              {actorName}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Кнопка переключения архивных актеров */}
                {hasArchivedActors && labels && (
                  <div className="cast-toggle-container">
                    <button
                      className="btn-more-subtle"
                      onClick={() => setShowArchivedActors(!showArchivedActors)}
                    >
                      {showArchivedActors
                        ? labels.buttons.hideArchivedActors
                        : labels.buttons.showArchivedActors}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })()}

      {/* 6. Action buttons (кнопки действия для публикаций) */}
      {buttons && buttons.length > 0 && (
        <div className="content-card">
          <div className="cta-section" style={{ textAlign: 'center', marginTop: '20px' }}>
            {buttons.slice(0, 2).map((buttonStr, i) => {
              const [text, href] = buttonStr.split(':')
              return (
                <span
                  key={i}
                  className={`internal-link ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}
                  data-href={href || '#'}
                  onClick={e => {
                    e.preventDefault()
                    window.history.pushState(null, '', href || '#')
                    window.dispatchEvent(new PopStateEvent('popstate'))
                  }}
                  style={{ cursor: 'pointer', marginRight: i === 0 ? '10px' : '0' }}
                >
                  {text}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* 7. Основной контент */}
      {page.content && (
        <div className="content-card">
          <div className="readable-content">{processHtmlContent(page.content)}</div>
        </div>
      )}

      {/* 8. Видео */}
      {page.video && (
        <div className="content-card">
          <div className="modal-gallery">
            {/* Проверяем, является ли video строкой или массивом строк */}
            {Array.isArray(page.video) ? (
              // Если это массив видео
              page.video.map((url: string, index: number) => (
                <VideoPlayer key={index} url={url} className="video-player-item" />
              ))
            ) : (
              // Если это одно видео
              <VideoPlayer url={page.video} />
            )}
          </div>
        </div>
      )}

      {/* 9. Галерея изображений */}
      {page.gallery && page.gallery.length > 0 && (
        <div className="content-card">
          <div className="modal-gallery">
            <ImageGallery images={page.gallery} />
          </div>
        </div>
      )}

      {/* 10. Кнопка связаться */}
      {showContactButton && page.contactButton && (
        <div className="page-actions">
          <Link to={page.contactButton.href} className="btn btn-primary">
            {page.contactButton.text}
          </Link>
        </div>
      )}

      {/* 11. Документы */}
      {page.documents && Object.keys(page.documents).length > 0 && labels && (
        <div className="content-card">
          <div className="readable-content">
            <h2>{labels.sections.documents}</h2>
          </div>
          <div className="documents-grid">
            {Object.entries(page.documents).map(([title, url], index) => (
              <div key={title.replace(/\s+/g, '-') || String(index)} className="document-card">
                <div
                  className="document-card-icon"
                  style={{ backgroundColor: getDocumentColor(url) }}
                >
                  {React.createElement(getDocumentIcon(url), { size: 24 })}
                </div>
                <div className="document-card-content">
                  <h3 className="document-card-title">{title}</h3>
                </div>
                <div className="document-card-action">
                  <a
                    className="icon-button"
                    href={getDocumentPreviewUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={labels.common.preview}
                    title={labels.common.preview}
                  >
                    <Eye size={16} />
                  </a>
                  <a
                    className="icon-button"
                    href={url}
                    download
                    aria-label={labels.common.download}
                    title={labels.common.download}
                  >
                    <Download size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default ContentPageRenderer
