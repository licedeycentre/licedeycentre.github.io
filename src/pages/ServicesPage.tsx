import React from 'react'
import { Link } from 'react-router-dom'
import { useServices } from '../hooks/useContent'
import { ImageGallery } from '../components/ImageGallery'
import { VideoPlayer } from '../components/VideoPlayer'
import PageLayout from '../components/PageLayout'

const ServicesPage: React.FC = () => {
  const servicesData = useServices()
  
  const services = [
    {
      icon: "🎭",
      title: "Выступления на заказ",
      audience: "Для мероприятий",
      description: "Корпоративные мероприятия, частные праздники, городские события. Спектакли из репертуара и индивидуальные постановки.",
      link: "/services/performances"
    },
    {
      icon: "🏛️",
      title: "Аренда зала",
      audience: "Для организаций",
      description: "Театральный зал до 100 человек с профессиональным оборудованием. Сцена 6×8 м, свет, звук, проекция.",
      link: "/services/hall"
    },
    {
      icon: "⚡",
      title: "Аренда оборудования",
      audience: "Для мероприятий",
      description: "Профессиональное театральное оборудование: свет, звук, декорации, костюмы с доставкой и монтажом.",
      link: "/services/equipment"
    }
  ]

  return (
    <PageLayout
      title="Услуги — Лицедей"
      description="Коммерческие услуги Центра Современного Искусства 'Лицедей'. Выступления на заказ, аренда зала и оборудования."
      keywords="услуги, выступления, аренда зала, аренда оборудования, Владивосток, Лицедей"
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Услуги' }
      ]}
      actions={[
        { text: 'Связаться с нами', href: '/contacts', variant: 'primary' }
      ]}
      centered={false}
    >
      <div className="content-card">
        <div className="readable-content">
          <h2>Наши услуги</h2>
          <p>Центр Современного Искусства «Лицедей» предлагает широкий спектр коммерческих услуг для организаций и частных лиц.</p>
        </div>
        
        <div className="directions-grid">
          {services.map((service, index) => (
            <div key={index} className="direction-card">
              <div className="direction-icon">{service.icon}</div>
              <div className="direction-content">
                <h3>{service.title}</h3>
                <p className="direction-audience">{service.audience}</p>
                <p className="direction-description">
                  {service.description}
                </p>
                <Link to={service.link} className="btn-primary">Подробнее</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Галерея */}
      {servicesData.gallery && servicesData.gallery.length > 0 && (
        <div className="content-card">
          <ImageGallery images={servicesData.gallery} />
        </div>
      )}

      {/* Видео */}
      {servicesData.video && (
        <div className="content-card">
          <VideoPlayer
            url={servicesData.video.url}
            title={servicesData.video.title}
            description={servicesData.video.description}
          />
        </div>
      )}
    </PageLayout>
  )
}

export default ServicesPage
