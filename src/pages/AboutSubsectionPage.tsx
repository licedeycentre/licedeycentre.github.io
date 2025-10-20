import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAbout } from '../hooks/useContent'
import { VideoPlayer } from '../components/VideoPlayer'
import PageLayout from '../components/PageLayout'
import { processHtmlContent } from '../utils/htmlProcessor'
import { Download } from 'lucide-react'
import { getDocumentIcon, getDocumentColor } from '../utils/documentIcons'

const AboutSubsectionPage: React.FC = () => {
  const { subsection } = useParams<{ subsection?: string }>()
  const aboutData = useAbout()

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
          <VideoPlayer
            url={subsectionData.video.url}
            title={subsectionData.video.title}
            description={subsectionData.video.description}
          />
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
      {subsectionData.documents && subsectionData.documents.length > 0 && (
        <div className="content-card">
          <div className="readable-content">
            <h2>Документы</h2>
          </div>
          <div className="documents-grid">
            {subsectionData.documents.map(doc => (
              <a
                key={doc.id}
                href={doc.url}
                className="document-card"
                download
                target="_blank"
                rel="noopener noreferrer"
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
                  <Download size={16} />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default AboutSubsectionPage
