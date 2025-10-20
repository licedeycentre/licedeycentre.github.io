import React from 'react'
import { useParams } from 'react-router-dom'
import { usePerformance } from '../hooks/useContent'
import { ImageGallery } from '../components/ImageGallery'
import { VideoPlayer } from '../components/VideoPlayer'
import { Slider } from '../components/Slider'
import { PerformanceInfoCard } from '../components/PerformanceInfoCard'
import PageLayout from '../components/PageLayout'
import { processHtmlContent } from '../utils/htmlProcessor'
import { VideoGroup as VideoGroupType } from '../types/content'
import { Download, Eye } from 'lucide-react'
import { getDocumentIcon, getDocumentColor, getDocumentPreviewUrl } from '../utils/documentIcons'

const PerformancePage: React.FC = () => {
  const { id } = useParams()
  const performance = usePerformance(id || '')

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
        ticketsUrl={performance.ticketsUrl}
        showTicketsButton={performance.showTicketsButton}
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
        {performance.detailedDescription && (
          <div className="content-card">
            <div className="readable-content">
              {processHtmlContent(performance.detailedDescription || '')}
            </div>
          </div>
        )}

        {/* Видео спектакля */}
        {performance.video && (
          <div className="content-card">
            {/* Проверяем, является ли video одиночным видео или массивом групп */}
            {Array.isArray(performance.video) ? (
              // Если это массив групп видео
              performance.video.map((group: VideoGroupType, index: number) => (
                <VideoPlayer key={index} title={group.title} videos={group.videos} />
              ))
            ) : (
              // Если это одиночное видео
              <VideoPlayer url={performance.video.url} title={performance.video.title} />
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
        {performance.documents && performance.documents.length > 0 && (
          <div className="content-card">
            <div className="readable-content">
              <h2>Документы</h2>
            </div>
            <div className="documents-grid">
              {performance.documents.map((doc, index) => (
                <div
                  key={
                    (doc.title && doc.title.replace(/\s+/g, '-')) ||
                    (doc.url.split('/').pop() || '').replace(/\.[^.]+$/, '') ||
                    String(index)
                  }
                  className="document-card"
                >
                  <div
                    className="document-card-icon"
                    style={{ backgroundColor: getDocumentColor(doc.url) }}
                  >
                    {React.createElement(getDocumentIcon(doc.url), { size: 24 })}
                  </div>
                  <div className="document-card-content">
                    <h3 className="document-card-title">{doc.title}</h3>
                    <p className="document-card-desc">{doc.description}</p>
                  </div>
                  <div className="document-card-action">
                    <a
                      className="icon-button"
                      href={getDocumentPreviewUrl(doc.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Предпросмотр"
                      title="Предпросмотр"
                    >
                      <Eye size={16} />
                    </a>
                    <a
                      className="icon-button"
                      href={doc.url}
                      download
                      aria-label="Скачать"
                      title="Скачать"
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
