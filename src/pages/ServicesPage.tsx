import React from 'react'
import { Link } from 'react-router-dom'
import { useServices } from '../hooks/useContent'
import { ImageGallery } from '../components/ImageGallery'
import { VideoPlayer } from '../components/VideoPlayer'
import PageLayout from '../components/PageLayout'

const ServicesPage: React.FC = () => {
  const servicesData = useServices()

  return (
    <PageLayout
      title="Услуги — Лицедей"
      description="Коммерческие услуги Центра Современного Искусства 'Лицедей'. Выступления на заказ, аренда зала и оборудования."
      keywords="услуги, выступления, аренда зала, аренда оборудования, Владивосток, Лицедей"
      breadcrumbs={[{ label: 'Главная', href: '/' }, { label: 'Услуги' }]}
      actions={[]}
      centered={false}
    >
      <div className="content-card">
        <div className="readable-content">
          <h2>Наши услуги</h2>
          {servicesData.introText && <p>{servicesData.introText}</p>}
        </div>

        <div className="directions-grid">
          {servicesData.services?.map((service, index) => (
            <div key={index} className="direction-card">
              <div className="direction-icon">{service.icon}</div>
              <div className="direction-content">
                <h3>{service.title}</h3>
                <p className="direction-audience">{service.audience}</p>
                <p className="direction-description">{service.description}</p>
                <Link to={service.link} className="btn-primary">
                  Подробнее
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Видео */}
      {servicesData.video && (
        <div className="content-card">
          <VideoPlayer url={servicesData.video} />
        </div>
      )}

      {/* Галерея */}
      {servicesData.gallery && servicesData.gallery.length > 0 && (
        <div className="content-card">
          <ImageGallery images={servicesData.gallery} />
        </div>
      )}

      {/* Кнопка связаться */}
      {servicesData.contactButton && (
        <div className="page-actions">
          <Link to={servicesData.contactButton.href} className="btn btn-primary">
            {servicesData.contactButton.text}
          </Link>
        </div>
      )}
    </PageLayout>
  )
}

export default ServicesPage
