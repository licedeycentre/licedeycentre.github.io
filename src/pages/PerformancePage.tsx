import React from 'react'
import { useParams } from 'react-router-dom'
import { usePerformance, useUILabels } from '../hooks/useContent'
import ContentPageRenderer from '../components/ContentPageRenderer'
import PageLayout from '../components/PageLayout'
import {
  generateSEOMetadata,
  generateBreadcrumbs,
  generate404Content,
  generateExtendedSEO,
} from '../utils/pageHelpers'

const PerformancePage: React.FC = () => {
  const { id } = useParams()
  const performance = usePerformance(id || '')
  const labels = useUILabels()

  // 404 страница
  if (!performance) {
    const notFoundContent = generate404Content('performance', '/performances', 'Спектакли')

    return (
      <PageLayout
        title={notFoundContent.title}
        description={notFoundContent.description}
        breadcrumbs={generateBreadcrumbs(
          'not-found',
          notFoundContent.parentLabel,
          '',
          notFoundContent.parentPath
        )}
        actions={[
          {
            text: notFoundContent.buttonText,
            href: notFoundContent.parentPath,
            variant: 'primary',
          },
        ]}
        centered={false}
      >
        <div className="content-card">
          <div className="readable-content">
            <p>{notFoundContent.message}</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Генерация SEO метаданных
  const seo = generateSEOMetadata('performance', performance)
  const breadcrumbs = generateBreadcrumbs(
    'performance',
    'Спектакли',
    performance.title,
    '/performances'
  )
  const extendedSEO = generateExtendedSEO('performance', performance)

  return (
    <>
      <PageLayout
        title={seo.title}
        description={seo.description}
        keywords={seo.keywords}
        breadcrumbs={breadcrumbs}
        seo={extendedSEO}
        centered={false}
        compactBreadcrumbs={true}
      >
        <ContentPageRenderer
          page={{
            title: performance.title,
            content: '', // Основной контент не используется для спектаклей
            video: performance.video,
            gallery: performance.gallery,
            documents: performance.documents,
            contactButton: undefined,
          }}
          labels={labels}
          slider={{
            images: performance.slider || [],
            title: performance.title,
            description: performance.description,
            showDates: performance.showDates,
            status: performance.status,
            tickets: performance.tickets,
          }}
          performanceInfo={performance}
          detailsContent={performance.details}
          cast={performance.cast}
          breadcrumbs={breadcrumbs}
        />
      </PageLayout>
    </>
  )
}

export default PerformancePage
