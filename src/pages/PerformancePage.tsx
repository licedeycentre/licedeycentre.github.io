import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePerformance } from '../hooks/useContent'
import { ImageGallery } from '../components/ImageGallery'
import { VideoPlayer } from '../components/VideoPlayer'
import { Slider } from '../components/Slider'
import { PerformanceInfoCard } from '../components/PerformanceInfoCard'
import PageLayout from '../components/PageLayout'
import { formatShowDate, filterFutureShowDates, sortShowDates, formatLastShowDate } from '../utils/dateFormat'
import { generatePerformanceId } from '../utils/slugify'
import { processHtmlContentSimple } from '../utils/htmlProcessor'
import { PerformanceVideo, VideoGroup as VideoGroupType } from '../types/content'
import { FileText, Download } from 'lucide-react'

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
          { label: 'Не найдено' }
        ]}
        actions={[
          { text: 'Вернуться к спектаклям', href: '/performances', variant: 'primary' }
        ]}
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
        description={performance.description || `Спектакль '${performance.title}' театра-студии 'Балаганчик' во Владивостоке.`}
        keywords={`спектакли, спектакль, ${performance.title}, театр, Владивосток, Балаганчик, ${performance.ageGroup || ''}`}
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'Спектакли', href: '/performances' },
          { label: performance.title }
        ]}
        centered={false}
      >
        <PerformanceInfoCard performance={performance} />
        
        {/* Подробное описание спектакля */}
        {performance.detailedDescription && (
          <div className="content-card">
            <div className="readable-content">
              {processHtmlContentSimple(performance.detailedDescription || '')}
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
                <VideoPlayer
                  key={index}
                  title={group.title}
                  videos={group.videos}
                />
              ))
            ) : (
              // Если это одиночное видео
              <VideoPlayer
                url={performance.video.url}
                title={performance.video.title}
              />
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
                  {performance.documents.map((doc) => (
                    <a 
                      key={doc.id} 
                      href={doc.url} 
                      className="document-card"
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="document-card-icon">
                        <FileText size={24} />
                      </div>
                      <div className="document-card-content">
                        <h3 className="document-card-title">{doc.title}</h3>
                        <p className="document-card-desc">{doc.description}</p>
                      </div>
                      <div className="document-card-action">
                        <Download size={16} />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
      </PageLayout>
    </>
  )
}

export default PerformancePage
