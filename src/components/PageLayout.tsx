import React from 'react'
import { Link } from 'react-router-dom'
import SEOHead from './SEOHead'
import { Performance, Publication } from '../types/content'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface PageAction {
  text: string
  href: string
  variant?: 'primary' | 'secondary'
}

export interface PageLayoutProps {
  // Базовое SEO (обязательно)
  title: string
  description: string
  keywords?: string

  // Расширенное SEO (опционально)
  seo?: {
    image?: string
    imageAlt?: string
    type?: 'website' | 'article' | 'profile'
    publishedTime?: string
    modifiedTime?: string
    author?: string
    tags?: string[]
    performance?: Performance
    publication?: Publication
    showLocalBusiness?: boolean
  }

  // Breadcrumbs
  breadcrumbs?: BreadcrumbItem[]

  // Content
  children: React.ReactNode

  // Actions
  actions?: PageAction[]

  // Layout options
  fullWidth?: boolean
  centered?: boolean
  compactBreadcrumbs?: boolean
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  keywords,
  seo,
  breadcrumbs = [],
  children,
  actions = [],
  fullWidth = false,
  centered = true,
  compactBreadcrumbs = false,
}) => {
  const containerClass = fullWidth ? 'container-fluid' : 'container'

  // Конвертируем breadcrumbs для Schema.org если они есть
  const seoBreadcrumbs = breadcrumbs
    .filter(item => item.href)
    .map(item => ({
      name: item.label,
      url: item.href || '',
    }))

  return (
    <>
      <SEOHead
        title={title}
        description={description}
        keywords={keywords}
        image={seo?.image}
        imageAlt={seo?.imageAlt}
        type={seo?.type}
        publishedTime={seo?.publishedTime}
        modifiedTime={seo?.modifiedTime}
        author={seo?.author}
        tags={seo?.tags}
        performance={seo?.performance}
        publication={seo?.publication}
        breadcrumbs={seoBreadcrumbs.length > 0 ? seoBreadcrumbs : undefined}
        showLocalBusiness={seo?.showLocalBusiness}
      />

      <div className={containerClass}>
        {/* Breadcrumbs - скрываем на страницах со слайдером */}
        {breadcrumbs.length > 0 && !compactBreadcrumbs && (
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <ol className="breadcrumb-list">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="breadcrumb-item">
                  {item.href ? (
                    <Link to={item.href} className="breadcrumb-link">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="breadcrumb-current">{item.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="breadcrumb-separator" aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6 4L10 8L6 12"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Main Content */}
        <main className={centered ? 'page-content-centered' : 'page-content'}>{children}</main>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="page-actions">
            {actions.map((action, index) => (
              <Link
                key={index}
                to={action.href}
                className={`btn ${action.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
              >
                {action.text}
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default PageLayout
