import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useServices } from '../hooks/useContent'
import { VideoPlayer } from '../components/VideoPlayer'
import PageLayout from '../components/PageLayout'
import { processHtmlContentSimple } from '../utils/htmlProcessor'

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
          { label: 'Не найдено' }
        ]}
        actions={[
          { text: 'Вернуться к разделу "Услуги"', href: '/services', variant: 'primary' }
        ]}
        centered={false}
      >
        <div className="error-page">
          <h1>Страница не найдена</h1>
          <p>Запрашиваемый подраздел не существует.</p>
        </div>
      </PageLayout>
    )
  }

  const subsectionData = servicesData.subsections[subsection as keyof typeof servicesData.subsections]

  if (!subsectionData) {
    return (
      <PageLayout
        title="Страница не найдена | Лицедей"
        description="Запрашиваемый подраздел не существует"
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'Услуги', href: '/services' },
          { label: 'Не найдено' }
        ]}
        actions={[
          { text: 'Вернуться к разделу "Услуги"', href: '/services', variant: 'primary' }
        ]}
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
    switch (subsection) {
      case 'performances':
        return 'Выступления на заказ'
      case 'hall':
        return 'Аренда зала'
      case 'equipment':
        return 'Аренда оборудования'
      default:
        return subsectionData.title
    }
  }

  const getPageDescription = () => {
    switch (subsection) {
      case 'performances':
        return 'Организуем выступления для ваших мероприятий. Корпоративные праздники, частные торжества, городские события.'
      case 'hall':
        return 'Аренда театрального зала для проведения мероприятий. Оборудованная сцена, свет, звук, гримерные.'
      case 'equipment':
        return 'Аренда профессионального театрального оборудования. Световое, звуковое оборудование, декорации.'
      default:
        return subsectionData.title
    }
  }

  const getKeywords = () => {
    switch (subsection) {
      case 'performances':
        return 'выступления на заказ, корпоративные мероприятия, частные праздники, театр, Владивосток'
      case 'hall':
        return 'аренда зала, театральный зал, аренда сцены, мероприятия, Владивосток'
      case 'equipment':
        return 'аренда оборудования, театральное оборудование, свет, звук, декорации, Владивосток'
      default:
        return 'услуги, театр, Владивосток'
    }
  }

  return (
    <PageLayout
      title={`${getPageTitle()} | Лицедей`}
      description={getPageDescription()}
      keywords={getKeywords()}
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Услуги', href: '/services' },
        { label: subsectionData.title }
      ]}
      actions={[
        { text: 'Связаться с нами', href: '/contacts', variant: 'primary' }
      ]}
      centered={false}
    >
      <div className="content-card">
        <div className="readable-content">
          {processHtmlContentSimple(subsectionData.content)}
        </div>
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
    </PageLayout>
  )
}

export default ServicesSubsectionPage
