import React from 'react'
import { useParams } from 'react-router-dom'
import { usePerformance, useUILabels } from '../hooks/useContent'
import { ImageGallery } from '../components/ImageGallery'
import { VideoPlayer } from '../components/VideoPlayer'
import { Slider } from '../components/Slider'
import { PerformanceInfoCard } from '../components/PerformanceInfoCard'
import PageLayout from '../components/PageLayout'
import { processHtmlContent } from '../utils/htmlProcessor'
import { Download, Eye } from 'lucide-react'
import { getDocumentIcon, getDocumentColor, getDocumentPreviewUrl } from '../utils/documentIcons'

const PerformancePage: React.FC = () => {
  const { id } = useParams()
  const performance = usePerformance(id || '')
  const labels = useUILabels()

  if (!performance) {
    return (
      <PageLayout
        title="Спектакль не найден — Лицедей"
        description="Запрашиваемый спектакль не найден."
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'Спектакли', href: '/performances' },
          { label: 'Не найдено' },
        ]}
        actions={[{ text: 'Вернуться к спектаклям', href: '/performances', variant: 'primary' }]}
        centered={false}
      >
        <div className="content-card">
          <div className="readable-content">
            <p>Спектакль не найден.</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <>
      <Slider
        mode="gallery"
        images={performance.slider || []}
        title={performance.title}
        description={performance.description}
        showDates={performance.showDates}
        performanceStatus={performance.status}
        tickets={performance.tickets}
      />

      <PageLayout
        title={`${performance.title} — Лицедей`}
        description={
          performance.description ||
          `Спектакль '${performance.title}' театра-студии 'Балаганчик' во Владивостоке.`
        }
        keywords={`спектакли, спектакль, ${performance.title}, театр, Владивосток, Балаганчик, ${performance.ageGroup || ''}`}
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'Спектакли', href: '/performances' },
          { label: performance.title },
        ]}
        centered={false}
      >
        <PerformanceInfoCard performance={performance} />

        {/* Подробное описание спектакля */}
        {performance.details && (
          <div className="content-card">
            <div className="readable-content">
              {processHtmlContent(performance.details || '')}
            </div>
          </div>
        )}

        {/* Действующие лица */}
        {performance.cast && Object.keys(performance.cast).length > 0 && (
          <div className="content-card">
            <div className="readable-content">
              <div className="cast-list">
                {Object.entries(performance.cast).map(([role, actors], index) => (
                  <div key={index} className="cast-member">
                    <div className="cast-role">{role}</div>
                    <div className="cast-actors">
                      {actors.map((actor, actorIndex) => {
                        const isArchived = actor.startsWith('*')
                        const actorName = isArchived ? actor.slice(1) : actor
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
            </div>
          </div>
        )}

        {/* Видео спектакля */}
        {performance.video && (
          <div className="content-card">
            {/* Проверяем, является ли video строкой или массивом строк */}
            {Array.isArray(performance.video) ? (
              // Если это массив видео
              performance.video.map((url: string, index: number) => (
                <VideoPlayer key={index} url={url} className="video-player-item" />
              ))
            ) : (
              // Если это одно видео
              <VideoPlayer url={performance.video} />
            )}
          </div>
        )}

        {/* Галерея и документы */}
        {performance.gallery && performance.gallery.length > 0 && (
          <div className="content-card">
            <ImageGallery images={performance.gallery} />
          </div>
        )}

        {/* Документы спектакля */}
        {performance.documents && Object.keys(performance.documents).length > 0 && (
          <div className="content-card">
            <div className="readable-content">
              <h2>{labels.sections.documents}</h2>
            </div>
            <div className="documents-grid">
              {Object.entries(performance.documents).map(([title, url], index) => (
                <div
                  key={title.replace(/\s+/g, '-') || String(index)}
                  className="document-card"
                >
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
      </PageLayout>
    </>
  )
}

export default PerformancePage
