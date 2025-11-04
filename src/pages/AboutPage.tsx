import React from 'react'
import { Link } from 'react-router-dom'
import { useAbout, useUILabels } from '../hooks/useContent'
import { ImageGallery } from '../components/ImageGallery'
import { VideoPlayer } from '../components/VideoPlayer'
import PageLayout from '../components/PageLayout'
import { processHtmlContent } from '../utils/htmlProcessor'
import { Download, Eye } from 'lucide-react'
import { getDocumentIcon, getDocumentColor, getDocumentPreviewUrl } from '../utils/documentIcons'

const AboutPage: React.FC = () => {
  const aboutData = useAbout()
  const labels = useUILabels()

  return (
    <PageLayout
      title="О нас — Лицедей"
      description="Центр Современного Искусства 'Лицедей' во Владивостоке. История, миссия, направления работы. Театральная студия 'Балаганчик' и инклюзивная театральная студия 'Без границ' для детей и взрослых."
      keywords="о нас, история, миссия, театральная студия, Владивосток, Лицедей, Балаган, Балаганчик"
      breadcrumbs={[{ label: 'Главная', href: '/' }, { label: 'О нас' }]}
      actions={[]}
      centered={false}
    >
      <div className="content-card">
        <div className="content-hero">
          <blockquote className="hero-quote">
            <p>{aboutData.quote}</p>
          </blockquote>
          <p className="hero-lead">{aboutData.leadText}</p>
        </div>
      </div>

      <div className="content-card">
        <div className="readable-content">
          <h2>Наша история</h2>
          {processHtmlContent(aboutData.history?.replace(/\n/g, '<br>') || '')}
        </div>
      </div>

      <div className="content-card">
        <div className="readable-content">
          <h2>Наша миссия</h2>
          {processHtmlContent(aboutData.mission?.replace(/\n/g, '<br>') || '')}
        </div>
      </div>

      <div className="content-card">
        <div className="readable-content">
          <h2>Направления деятельности</h2>
        </div>

        <div className="directions-grid">
          {aboutData.directions?.map((direction, index) => (
            <div key={index} className="direction-card">
              <div className="direction-icon">{direction.icon}</div>
              <div className="direction-content">
                <h3>{direction.title}</h3>
                <p className="direction-audience">{direction.audience}</p>
                <p className="direction-description">{direction.description}</p>
                <Link to={direction.link} className="btn-primary">
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Видео */}
      {aboutData.video && (
        <div className="content-card">
          <VideoPlayer url={aboutData.video} />
        </div>
      )}

      {/* Галерея */}
      {aboutData.gallery && aboutData.gallery.length > 0 && (
        <div className="content-card">
          <ImageGallery images={aboutData.gallery} />
        </div>
      )}

      {/* Кнопка связаться */}
      {aboutData.contactButton && (
        <div className="page-actions">
          <Link to={aboutData.contactButton.href} className="btn btn-primary">
            {aboutData.contactButton.text}
          </Link>
        </div>
      )}

      {/* Документы центра */}
      {aboutData.documents && Object.keys(aboutData.documents).length > 0 && (
        <div className="content-card">
          <div className="readable-content">
            <h2>{labels.sections.documents}</h2>
          </div>
          <div className="documents-grid">
            {Object.entries(aboutData.documents).map(([title, url], index) => (
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
    </PageLayout>
  )
}

export default AboutPage
