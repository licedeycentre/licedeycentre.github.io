import React from 'react'
import { Link } from 'react-router-dom'
import {
  useHeroSlides,
  useSortedPublications,
  useSortedPerformances,
  useSEO,
} from '../hooks/useContent'
import { MediaThumb } from '../components/MediaThumb'
import { PerformanceCard } from '../components/PerformanceCard'
import { Slider } from '../components/Slider'
import SEOHead from '../components/SEOHead'
import { formatDate } from '../utils/dateFormat'
import { ChevronRight } from 'lucide-react'
import { generatePerformanceId, generatePublicationId } from '../utils/slugify'

// Компонент превью публикаций на главной
const HomePreviews: React.FC = () => {
  const publications = useSortedPublications()
  const performances = useSortedPerformances(6)

  // Показываем карточки в гриде
  const pubShowCount = 4
  const pubPreview = publications.slice(0, pubShowCount)

  // Если контент пустой, показываем заглушки
  if (publications.length === 0 && performances.length === 0) {
    return (
      <>
        <section className="section section--compact">
          <div className="container">
            <div className="section-header-with-nav">
              <h2 className="link-title">
                <Link to="/publications" className="section-title-link">
                  Публикации
                </Link>
              </h2>
            </div>
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
              Публикации не найдены
            </div>
          </div>
        </section>

        <section className="section section--compact">
          <div className="container">
            <div className="section-header-with-nav">
              <h2 className="link-title">
                <Link to="/performances" className="section-title-link">
                  Спектакли
                </Link>
              </h2>
            </div>
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
              Спектакли не найдены
            </div>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="section section--compact">
        <div className="container">
          <div className="section-header-centered">
            <h2>Ближайшие показы</h2>
          </div>
          {performances.length > 0 ? (
            <>
              <div className="performances-grid">
                {performances.map(p => (
                  <PerformanceCard
                    key={generatePerformanceId(p.title)}
                    performance={p}
                    showDates={true}
                    maxDates={3}
                  />
                ))}
              </div>
              <div className="section-footer">
                <Link to="/performances" className="btn-more-subtle">
                  Ещё спектакли
                  <ChevronRight size={14} />
                </Link>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Спектакли скоро появятся</p>
            </div>
          )}
        </div>
      </section>

      <section className="section section--compact">
        <div className="container">
          <div className="section-header-centered">
            <h2>Свежие публикации</h2>
          </div>
          {pubPreview.length > 0 && (
            <>
              <div className="publications-grid">
                {pubPreview.map(post => (
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
                      <h3 className="card-title">{post.title}</h3>
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
              </div>
              <div className="section-footer">
                <Link to="/publications" className="btn-more-subtle">
                  Ещё публикации
                  <ChevronRight size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}

// Компонент слайдера героя
const HeroSlider: React.FC = () => {
  const slides = useHeroSlides()
  return <Slider mode="hero" slides={slides} />
}

// Главная страница
const HomePage: React.FC = () => {
  const seoData = useSEO()
  const homePageSEO = seoData.pages.home || {
    title: 'Лицедей — Центр Современного Искусства',
    description:
      "Театр‑студия 'Балаганчик' во Владивостоке. Актерское мастерство, сценическая речь, спектакли для детей и взрослых.",
    keywords:
      'театр, актерское мастерство, Владивосток, театральная студия, Балаганчик, спектакли, сценическая речь',
  }

  return (
    <>
      <SEOHead
        title={homePageSEO.title}
        description={homePageSEO.description}
        keywords={homePageSEO.keywords}
        url="/"
      />
      <main>
        <HeroSlider />
        <HomePreviews />
      </main>
    </>
  )
}

export default HomePage
