import React from 'react'
import { useParams } from 'react-router-dom'
import { usePublication, useUILabels } from '../hooks/useContent'
import ContentPageRenderer from '../components/ContentPageRenderer'
import PageLayout from '../components/PageLayout'
import {
  generateSEOMetadata,
  generateBreadcrumbs,
  generate404Content,
  generateExtendedSEO,
} from '../utils/pageHelpers'

const PublicationPage: React.FC = () => {
  const { id } = useParams()
  const post = usePublication(id || '')
  const labels = useUILabels()

  // 404 страница
  if (!post) {
    const notFoundContent = generate404Content('publication', '/publications', 'Публикации')

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
      >
        <div className="content-card">
          <div className="content-text">
            <p>{notFoundContent.message}</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Генерация SEO метаданных
  const seo = generateSEOMetadata('publication', post)
  const breadcrumbs = generateBreadcrumbs('publication', 'Публикации', post.title, '/publications')
  const extendedSEO = generateExtendedSEO('publication', post)

  return (
    <PageLayout
      title={seo.title}
      description={seo.description}
      keywords={seo.keywords}
      breadcrumbs={breadcrumbs}
      seo={extendedSEO}
      centered={false}
    >
      <ContentPageRenderer
        page={{
          title: post.title,
          content: post.details || '',
          video: post.video,
          gallery: post.gallery,
          documents: post.documents,
          contactButton: undefined,
        }}
        labels={labels}
        header={{
          title: post.title,
          date: post.date,
          tags: post.tags,
          image: post.image,
        }}
        buttons={post.buttons}
      />
    </PageLayout>
  )
}

export default PublicationPage
