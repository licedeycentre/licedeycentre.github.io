import React from 'react'
import { useParams } from 'react-router-dom'
import { usePublication } from '../hooks/useContent'
import { ImageGallery } from '../components/ImageGallery'
import { VideoPlayer } from '../components/VideoPlayer'
import PageLayout from '../components/PageLayout'
import { formatDate } from '../utils/dateFormat'
import { processHtmlContent } from '../utils/htmlProcessor'
import { VideoGroup as VideoGroupType } from '../types/content'
import { Download } from 'lucide-react'
import { getDocumentIcon, getDocumentColor } from '../utils/documentIcons'

const PublicationPage: React.FC = () => {
  const { id } = useParams()
  const post = usePublication(id || '')

  if (!post) {
    return (
      <PageLayout
        title="Публикация не найдена — Лицедей"
        description="Запрашиваемая публикация не найдена."
        breadcrumbs={[
          { label: 'Главная', href: '/' },
          { label: 'Публикации', href: '/publications' },
          { label: 'Не найдено' },
        ]}
      >
        <div className="content-card">
          <div className="content-text">
            <p>Публикация не найдена.</p>
          </div>
        </div>
      </PageLayout>
    )
  }

  // Извлекаем текст из HTML для описания
  const getTextFromHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html || ''
    const p = Array.from(tmp.querySelectorAll('p')).find(
      el => el.textContent && el.textContent.trim().length > 0
    )
    const text = (p?.textContent || tmp.textContent || '').replace(/\s+/g, ' ').trim()
    return text.split(/\s+/).slice(0, 30).join(' ') + (text.split(/\s+/).length > 30 ? '…' : '')
  }

  return (
    <PageLayout
      title={`${post.title} — Лицедей`}
      description={
        getTextFromHtml(post.html) ||
        `Публикация '${post.title}' театра-студии 'Балаганчик' во Владивостоке.`
      }
      keywords={`публикация, ${post.title}, театр, Владивосток, Балаганчик, ${(post.tags || []).join(', ')}`}
      breadcrumbs={[
        { label: 'Главная', href: '/' },
        { label: 'Публикации', href: '/publications' },
        { label: post.title },
      ]}
      centered={false}
    >
      <div className="content-card">
        <header className="detail-header">
          {(post.date || (post.tags && post.tags.length)) && (
            <div className="detail-meta">
              {post.date && <span>{formatDate(post.date)}</span>}
              {post.tags && post.tags.length > 0 && <span>{post.tags.join(' • ')}</span>}
            </div>
          )}
          <h1>{post.title}</h1>
        </header>

        {/* Обложка публикации */}
        {post.image && (
          <div className="publication-cover">
            <img src={post.image} alt={post.title} loading="lazy" />
          </div>
        )}
        <article className="detail-content readable-content">
          {processHtmlContent(post.html || '')}
        </article>

        {/* Кнопка действия */}
        {post.button && (
          <div className="cta-section" style={{ textAlign: 'center', marginTop: '20px' }}>
            <span
              className="internal-link btn-primary"
              data-href={post.button.url}
              onClick={e => {
                e.preventDefault()
                window.history.pushState(null, '', post.button!.url)
                window.dispatchEvent(new PopStateEvent('popstate'))
              }}
              style={{ cursor: 'pointer' }}
            >
              {post.button.text}
            </span>
          </div>
        )}
      </div>

      {/* Видео публикации */}
      {post.video && (
        <div className="content-card">
          <div className="modal-gallery">
            {/* Проверяем, является ли video одиночным видео или массивом групп */}
            {Array.isArray(post.video) ? (
              // Если это массив групп видео
              post.video.map((group: VideoGroupType, index: number) => (
                <VideoPlayer key={index} title={group.title} videos={group.videos} />
              ))
            ) : (
              // Если это одиночное видео
              <VideoPlayer
                url={post.video.url}
                title={post.video.title}
                description={post.video.description}
              />
            )}
          </div>
        </div>
      )}

      {/* Галерея изображений */}
      {post.gallery && post.gallery.length > 0 && (
        <div className="content-card">
          <div className="modal-gallery">
            <ImageGallery images={post.gallery as string[]} />
          </div>
        </div>
      )}

      {/* Документы публикации */}
      {post.documents && post.documents.length > 0 && (
        <div className="content-card">
          <div className="readable-content">
            <h2>Документы</h2>
          </div>
          <div className="documents-grid">
            {post.documents.map(doc => (
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
                  <h4 className="document-card-title">{doc.title}</h4>
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

export default PublicationPage
