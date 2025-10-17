import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAbout } from '../hooks/useContent'
import { VideoPlayer } from '../components/VideoPlayer'
import PageLayout from '../components/PageLayout'
import { processHtmlContentSimple } from '../utils/htmlProcessor'
import { FileText, Download } from 'lucide-react'

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
          { label: 'Не найдено' }
        ]}
        actions={[
          { text: 'Вернуться к разделу "О нас"', href: '/about', variant: 'primary' }
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

  const subsectionData = aboutData.subsections[subsection as keyof typeof aboutData.subsections]

  if (!subsectionData) {
    return (
      <PageLayout
        title="Страница не найдена | Лицедей"
        description="Запрашиваемый подраздел не существует"
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'О нас', href: '/about' },
          { label: 'Не найдено' }
        ]}
        actions={[
          { text: 'Вернуться к разделу "О нас"', href: '/about', variant: 'primary' }
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
      case 'studio':
        return 'Театральная студия «Балаганчик»'
      case 'inclusive':
        return 'Инклюзивная театральная студия «Без границ»'
      case 'theater':
        return 'Театр Балаган'
      case 'summer-camp':
        return 'Летний театральный лагерь'
      default:
        return subsectionData.title
    }
  }

  const getPageDescription = () => {
    switch (subsection) {
      case 'studio':
        return 'Театральная студия для взрослых и детей. Обучение актерскому мастерству, сценической речи, пластике. Игровые методики, развитие воображения и коммуникативных навыков.'
      case 'inclusive':
        return 'Специализированная студия для людей с ограниченными возможностями здоровья. Адаптивные программы, индивидуальный подход, арт-терапия.'
      case 'theater':
        return 'Профессиональный театр Балаган. Регулярные показы спектаклей для широкой аудитории. Репертуар для зрителей всех возрастов.'
      case 'summer-camp':
        return 'Летний театральный лагерь для детей 6-14 лет. Театральные тренинги, постановка спектаклей, творческие занятия, экскурсии. Дневное пребывание с 5-разовым питанием.'
      default:
        return subsectionData.title
    }
  }

  const getKeywords = () => {
    switch (subsection) {
      case 'studio':
        return 'театр, студия, актерское мастерство, Владивосток, обучение, театральная студия'
      case 'inclusive':
        return 'театр, инклюзия, ОВЗ, адаптивные программы, арт-терапия, Владивосток'
      case 'theater':
        return 'театр, Балаган, спектакли, репертуар, Владивосток, театральные постановки'
      case 'summer-camp':
        return 'летний лагерь, детский лагерь, театральный лагерь, Владивосток, каникулы, театральная мастерская'
      default:
        return 'театр, студия, Владивосток'
    }
  }

  return (
    <PageLayout
      title={`${getPageTitle()} | Лицедей`}
      description={getPageDescription()}
      keywords={getKeywords()}
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'О нас', href: '/about' },
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

      {/* Документы для скачивания */}
      {subsectionData.documents && subsectionData.documents.length > 0 && (
        <div className="content-card">
          <div className="readable-content">
            <h2>Документы</h2>
          </div>
          <div className="documents-grid">
            {subsectionData.documents.map((doc) => (
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
  )
}

export default AboutSubsectionPage
