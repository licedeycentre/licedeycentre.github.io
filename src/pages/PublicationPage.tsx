import React from 'react'
import { useParams } from 'react-router-dom'
import { usePublication, useUILabels } from '../hooks/useContent'
import { ImageGallery } from '../components/ImageGallery'
import { VideoPlayer } from '../components/VideoPlayer'
import PageLayout from '../components/PageLayout'
import { formatDate } from '../utils/dateFormat'
import { processHtmlContent } from '../utils/htmlProcessor'
import { Download, Eye } from 'lucide-react'
import { getDocumentIcon, getDocumentColor, getDocumentPreviewUrl } from '../utils/documentIcons'

const PublicationPage: React.FC = () => {
  const { id } = useParams()
  const post = usePublication(id || '')
  const labels = useUILabels()

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
        getTextFromHtml(post.details) ||
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
          {processHtmlContent(post.details || '')}
        </article>

        {/* Кнопки действия */}
        {post.buttons && post.buttons.length > 0 && (
          <div className="cta-section" style={{ textAlign: 'center', marginTop: '20px' }}>
            {post.buttons.slice(0, 2).map((buttonStr, i) => {
              const [text, href] = buttonStr.split(':')
              return (
                <span
                  key={i}
                  className={`internal-link ${i === 0 ? 'btn-primary' : 'btn-secondary'}`}
                  data-href={href || '#'}
                  onClick={e => {
                    e.preventDefault()
                    window.history.pushState(null, '', href || '#')
                    window.dispatchEvent(new PopStateEvent('popstate'))
                  }}
                  style={{ cursor: 'pointer', marginRight: i === 0 ? '10px' : '0' }}
                >
                  {text}
                </span>
              )
            })}
          </div>
        )}
      </div>

      {/* Видео публикации */}
      {post.video && (
        <div className="content-card">
          <div className="modal-gallery">
            {/* Проверяем, является ли video строкой или массивом строк */}
            {Array.isArray(post.video) ? (
              // Если это массив видео
              post.video.map((url: string, index: number) => (
                <VideoPlayer key={index} url={url} className="video-player-item" />
              ))
            ) : (
              // Если это одно видео
              <VideoPlayer url={post.video} />
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
      {post.documents && Object.keys(post.documents).length > 0 && (
        <div className="content-card">
          <div className="readable-content">
            <h2>{labels.sections.documents}</h2>
          </div>
          <div className="documents-grid">
            {Object.entries(post.documents).map(([title, url], index) => (
              <div
                key={title.replace(/\s+/g, '-') || String(index)}
                className="document-card"
              >
                <div
                  className="document-card-icon"
                  style={{ backgroundColor: getDocumentColor(url) }}
                >
                  {React.createElement(getDocumentIcon(url), { size: 24 })}
                </div>
                <div className="document-card-content">
                  <h4 className="document-card-title">{title}</h4>
                </div>
                <div className="document-card-action">
                  <a
                    className="icon-button"
                    href={getDocumentPreviewUrl(url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={labels.common.preview}
                    title={labels.common.preview}
                  >
                    <Eye size={16} />
                  </a>
                  <a
                    className="icon-button"
                    href={url}
                    download
                    aria-label={labels.common.download}
                    title={labels.common.download}
                  >
                    <Download size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageLayout>
  )
}

export default PublicationPage
