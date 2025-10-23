import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useServices } from '../hooks/useContent'
import { VideoPlayer } from '../components/VideoPlayer'
import PageLayout from '../components/PageLayout'
import { processHtmlContent } from '../utils/htmlProcessor'

const ServicesSubsectionPage: React.FC = () => {
  const { subsection } = useParams<{ subsection: string }>()
  const servicesData = useServices()

  if (!subsection || !servicesData?.subsections) {
    return (
      <PageLayout
        title="Страница не найдена | Лицедей"
        description="Запрашиваемый подраздел не существует"
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'Услуги', href: '/services' },
          { label: 'Не найдено' },
        ]}
        actions={[{ text: 'Вернуться к разделу "Услуги"', href: '/services', variant: 'primary' }]}
        centered={false}
      >
        <div className="error-page">
          <h1>Страница не найдена</h1>
          <p>Запрашиваемый подраздел не существует.</p>
        </div>
      </PageLayout>
    )
  }

  const subsectionData =
    servicesData.subsections[subsection as keyof typeof servicesData.subsections]

  if (!subsectionData) {
    return (
      <PageLayout
        title="Страница не найдена | Лицедей"
        description="Запрашиваемый подраздел не существует"
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'Услуги', href: '/services' },
          { label: 'Не найдено' },
        ]}
        actions={[{ text: 'Вернуться к разделу "Услуги"', href: '/services', variant: 'primary' }]}
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
    return subsectionData.seoKeywords || 'услуги, театр, Владивосток'
  }

  return (
    <PageLayout
      title={`${getPageTitle()} | Лицедей`}
      description={getPageDescription()}
      keywords={getKeywords()}
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Услуги', href: '/services' },
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
    </PageLayout>
  )
}

export default ServicesSubsectionPage
