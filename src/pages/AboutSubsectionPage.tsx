import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAbout, useUILabels } from '../hooks/useContent'
import { VideoPlayer } from '../components/VideoPlayer'
import PageLayout from '../components/PageLayout'
import { processHtmlContent } from '../utils/htmlProcessor'
import { Download, Eye } from 'lucide-react'
import { getDocumentIcon, getDocumentColor, getDocumentPreviewUrl } from '../utils/documentIcons'

const AboutSubsectionPage: React.FC = () => {
  const { subsection } = useParams<{ subsection?: string }>()
  const aboutData = useAbout()
  const labels = useUILabels()

  if (!subsection || !aboutData?.subsections) {
    return (
      <PageLayout
        title="Страница не найдена | Лицедей"
        description="Запрашиваемый подраздел не существует"
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'О нас', href: '/about' },
          { label: 'Не найдено' },
        ]}
        actions={[{ text: 'Вернуться к разделу "О нас"', href: '/about', variant: 'primary' }]}
        centered={false}
      >
        <div className="error-page">
          <h1>Страница не найдена</h1>
          <p>Запрашиваемый подраздел не существует.</p>
        </div>
      </PageLayout>
    )
  }

  const subsectionData = aboutData.subsections[subsection as keyof typeof aboutData.subsections]

  if (!subsectionData) {
    return (
      <PageLayout
        title="Страница не найдена | Лицедей"
        description="Запрашиваемый подраздел не существует"
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'О нас', href: '/about' },
          { label: 'Не найдено' },
        ]}
        actions={[{ text: 'Вернуться к разделу "О нас"', href: '/about', variant: 'primary' }]}
        centered={false}
      >
        <div className="error-page">
          <h1>Страница не найдена</h1>
          <p>Запрашиваемый подраздел не существует.</p>
        </div>
      </PageLayout>
    )
  }

  const getPageTitle = () => {
    return subsectionData.seoTitle || subsectionData.title
  }

  const getPageDescription = () => {
    return subsectionData.seoDescription || subsectionData.title
  }

  const getKeywords = () => {
    return subsectionData.seoKeywords || 'театр, студия, Владивосток'
  }

  return (
    <PageLayout
      title={`${getPageTitle()} | Лицедей`}
      description={getPageDescription()}
      keywords={getKeywords()}
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'О нас', href: '/about' },
        { label: subsectionData.title },
      ]}
      actions={[]}
      centered={false}
    >
      <div className="content-card">
        <div className="readable-content">{processHtmlContent(subsectionData.content)}</div>
      </div>

      {/* Видео */}
      {subsectionData.video && (
        <div className="content-card">
          <VideoPlayer url={subsectionData.video} />
        </div>
      )}

      {/* Кнопка связаться */}
      {subsectionData.contactButton && (
        <div className="page-actions">
          <Link to={subsectionData.contactButton.href} className="btn btn-primary">
            {subsectionData.contactButton.text}
          </Link>
        </div>
      )}

      {/* Документы для скачивания */}
      {subsectionData.documents && Object.keys(subsectionData.documents).length > 0 && (
        <div className="content-card">
          <div className="readable-content">
            <h2>{labels.sections.documents}</h2>
          </div>
          <div className="documents-grid">
            {Object.entries(subsectionData.documents).map(([title, url], index) => (
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
  )
}

export default AboutSubsectionPage
