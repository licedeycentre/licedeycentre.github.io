import React from 'react'
import { Link } from 'react-router-dom'
import SEOHead from './SEOHead'

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
  // SEO
  title: string
  description: string
  keywords?: string
  
  // Breadcrumbs
  breadcrumbs?: BreadcrumbItem[]
  
  // Content
  children: React.ReactNode
  
  // Actions
  actions?: PageAction[]
  
  // Optional header content
  headerContent?: React.ReactNode
  
  // Optional sidebar content
  sidebarContent?: React.ReactNode
  
  // Layout options
  fullWidth?: boolean
  centered?: boolean
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  keywords,
  breadcrumbs = [],
  children,
  actions = [],
  headerContent,
  sidebarContent,
  fullWidth = false,
  centered = true
}) => {
  const containerClass = fullWidth ? 'container-fluid' : 'container'
  
  return (
    <>
      <SEOHead
        title={title}
        description={description}
        keywords={keywords}
      />
      
      <div className={containerClass}>
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
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
                    <span className="breadcrumb-separator">/</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Header Content */}
        {headerContent && (
          <div className="page-header">
            {headerContent}
          </div>
        )}

        {/* Main Content */}
        <div className={`page-layout ${sidebarContent ? 'with-sidebar' : ''}`}>
          <main className={centered ? 'page-content-centered' : 'page-content'}>
            {children}
          </main>
          
          {/* Sidebar */}
          {sidebarContent && (
            <aside className="page-sidebar">
              {sidebarContent}
            </aside>
          )}
        </div>

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
