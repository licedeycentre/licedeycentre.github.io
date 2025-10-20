import React, { useState, useMemo, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useSortedPublications } from '../hooks/useContent'
import { MediaThumb } from '../components/MediaThumb'
import PageLayout from '../components/PageLayout'
import { formatDate } from '../utils/dateFormat'
import { generatePublicationId } from '../utils/slugify'

const PublicationsPage: React.FC = () => {
  const publications = useSortedPublications()
  const [searchParams, setSearchParams] = useSearchParams()
  const tagFromUrl = searchParams.get('tag') || 'all'
  const [activeFilter, setActiveFilter] = useState<string>(tagFromUrl)
  const [showAllTags, setShowAllTags] = useState<boolean>(false)
  const [showDropdown, setShowDropdown] = useState<boolean>(false)

  // Синхронизируем с URL при загрузке
  useEffect(() => {
    setActiveFilter(tagFromUrl)
  }, [tagFromUrl])

  // Собираем все уникальные теги и их частоту
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    publications.forEach(pub => {
      pub.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return counts
  }, [publications])

  // Получаем все теги отсортированные по частоте
  const allTagsSorted = useMemo(() => {
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
  }, [tagCounts])

  // Определяем видимые теги
  const visibleTags = useMemo(() => {
    if (!showAllTags) {
      return allTagsSorted.slice(0, 8)
    } else if (allTagsSorted.length > 20) {
      return allTagsSorted.slice(0, 20)
    }
    return allTagsSorted
  }, [allTagsSorted, showAllTags])

  // Фильтруем публикации
  const filteredPublications = useMemo(() => {
    if (activeFilter === 'all') {
      return publications
    }
    return publications.filter(pub => pub.tags.includes(activeFilter))
  }, [publications, activeFilter])

  // Обработчик смены фильтра
  const handleFilterChange = (tag: string) => {
    setActiveFilter(tag)
    setShowDropdown(false)
    if (tag === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ tag })
    }
  }

  // Обработчик раскрытия тегов
  const handleToggleTags = () => {
    setShowAllTags(!showAllTags)
  }

  const totalTags = allTagsSorted.length
  const hiddenTagsCount = totalTags - 8
  const hasMoreTags = totalTags > 8
  const needsDropdown = totalTags > 20 && showAllTags

  return (
    <PageLayout
      title="Публикации — Лицедей"
      description="Новости, статьи и публикации театра-студии 'Балаганчик' во Владивостоке. Информация о спектаклях, занятиях и мероприятиях."
      keywords="публикации, новости, статьи, театр, Владивосток, Балаганчик, мероприятия"
      breadcrumbs={[{ label: 'Главная', href: '/' }, { label: 'Публикации' }]}
      centered={false}
    >
      {/* Фильтры */}
      {totalTags > 0 && (
        <div className="publications-filters">
          <button
            className={`filter-button ${activeFilter === 'all' ? 'filter-button--active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            Все ({publications.length})
          </button>

          {visibleTags.map(tag => (
            <button
              key={tag}
              className={`filter-button ${activeFilter === tag ? 'filter-button--active' : ''}`}
              onClick={() => handleFilterChange(tag)}
            >
              {tag} ({tagCounts[tag]})
            </button>
          ))}

          {/* Кнопка раскрытия */}
          {hasMoreTags && (
            <button className="tags-toggle-button" onClick={handleToggleTags}>
              {showAllTags ? 'Свернуть' : `Показать ещё ${hiddenTagsCount}`}
            </button>
          )}

          {/* Dropdown для большого количества тегов */}
          {needsDropdown && (
            <div className="tags-dropdown-container">
              <button
                className="tags-dropdown-button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                Все теги ({totalTags}) ▼
              </button>

              {showDropdown && (
                <div className="tags-dropdown-menu">
                  {allTagsSorted.map(tag => (
                    <button
                      key={tag}
                      className={`filter-button ${activeFilter === tag ? 'filter-button--active' : ''}`}
                      onClick={() => handleFilterChange(tag)}
                    >
                      {tag} ({tagCounts[tag]})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="publications-grid">
        {filteredPublications.map(post => (
          <Link
            key={generatePublicationId(post.title, post.date)}
            to={`/publications/${generatePublicationId(post.title, post.date)}`}
            className="publication-card"
          >
            <MediaThumb
              src={post.image}
              alt={post.title}
              containerClass="publication-image"
              placeholderClass="publication-placeholder"
            />
            <div className="card-content-area">
              <h2 className="card-title">{post.title}</h2>
              {post.tags && post.tags.length > 0 && (
                <div className="card-meta">
                  {post.tags.map((tag: string, i: number) => (
                    <span key={i} className="card-meta-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {post.date && <div className="card-date">{formatDate(post.date)}</div>}
            </div>
          </Link>
        ))}
        {filteredPublications.length === 0 && <p>Публикаций с выбранным фильтром пока нет.</p>}
      </div>
    </PageLayout>
  )
}

export default PublicationsPage
