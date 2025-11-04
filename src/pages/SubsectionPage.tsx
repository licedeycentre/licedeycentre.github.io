import React from 'react'
import { useParams } from 'react-router-dom'
import { useAbout, useServices, useUILabels } from '../hooks/useContent'
import ContentPageRenderer from '../components/ContentPageRenderer'
import PageLayout from '../components/PageLayout'
import {
  generateSEOMetadata,
  generateBreadcrumbs,
  generate404Content,
  generateExtendedSEO,
} from '../utils/pageHelpers'
import { ContentSubsection } from '../types/content'

interface SubsectionPageProps {
  type: 'about' | 'services'
}

const SubsectionPage: React.FC<SubsectionPageProps> = ({ type }) => {
  const { subsection } = useParams<{ subsection?: string }>()
  const aboutData = useAbout()
  const servicesData = useServices()
  const labels = useUILabels()

  // Определяем данные в зависимости от типа
  const data = type === 'about' ? aboutData : servicesData
  const parentLabel = type === 'about' ? 'О нас' : 'Услуги'
  const parentPath = type === 'about' ? '/about' : '/services'
  const defaultKeywords =
    type === 'about' ? 'театр, студия, Владивосток' : 'услуги, театр, Владивосток'

  // Проверка существования подразделов
  if (!subsection || !data?.subsections) {
    const notFoundContent = generate404Content('subsection', parentPath, parentLabel)

    return (
      <PageLayout
        title={notFoundContent.title}
        description={notFoundContent.description}
        breadcrumbs={generateBreadcrumbs('not-found', parentLabel, '', parentPath)}
        actions={[
          {
            text: notFoundContent.buttonText,
            href: notFoundContent.parentPath,
            variant: 'primary',
          },
        ]}
        centered={false}
      >
        <div className="error-page">
          <h1>Страница не найдена</h1>
          <p>{notFoundContent.message}</p>
        </div>
      </PageLayout>
    )
  }

  // Получение данных подраздела
  const subsectionData = data.subsections[subsection as keyof typeof data.subsections] as
    | ContentSubsection
    | undefined

  if (!subsectionData) {
    const notFoundContent = generate404Content('subsection', parentPath, parentLabel)

    return (
      <PageLayout
        title={notFoundContent.title}
        description={notFoundContent.description}
        breadcrumbs={generateBreadcrumbs('not-found', parentLabel, '', parentPath)}
        actions={[
          {
            text: notFoundContent.buttonText,
            href: notFoundContent.parentPath,
            variant: 'primary',
          },
        ]}
        centered={false}
      >
        <div className="error-page">
          <h1>Страница не найдена</h1>
          <p>{notFoundContent.message}</p>
        </div>
      </PageLayout>
    )
  }

  // Генерация SEO метаданных
  const seo = generateSEOMetadata('subsection', subsectionData, defaultKeywords)
  const breadcrumbs = generateBreadcrumbs(
    'subsection',
    parentLabel,
    subsectionData.title,
    parentPath
  )
  const extendedSEO = generateExtendedSEO('subsection', subsectionData)

  return (
    <PageLayout
      title={seo.title}
      description={seo.description}
      keywords={seo.keywords}
      breadcrumbs={breadcrumbs}
      seo={extendedSEO}
      actions={[]}
      centered={false}
    >
      <ContentPageRenderer
        page={{
          title: subsectionData.title,
          content: subsectionData.content,
          video: subsectionData.video,
          gallery: subsectionData.gallery,
          documents: subsectionData.documents,
          contactButton: subsectionData.contactButton,
        }}
        labels={labels}
      />
    </PageLayout>
  )
}

export default SubsectionPage
