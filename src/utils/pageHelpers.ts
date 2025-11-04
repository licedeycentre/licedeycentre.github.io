import { Publication, Performance, ContentSubsection } from '../types/content'

export interface SEOMetadata {
  title: string
  description: string
  keywords: string
}

export interface Breadcrumb {
  label: string
  href?: string
}

export interface ExtendedSEO {
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

/**
 * Генерация SEO метаданных для разных типов страниц
 */
export const generateSEOMetadata = (
  type: 'publication' | 'performance' | 'subsection',
  data: Publication | Performance | ContentSubsection,
  parentLabel?: string
): SEOMetadata => {
  const baseTitle = ' — Лицедей'
  const baseLocation = "театра-студии 'Балаганчик' во Владивостоке"

  switch (type) {
    case 'publication': {
      const post = data as Publication
      const getTextFromHtml = (html: string) => {
        const tmp = document.createElement('div')
        tmp.innerHTML = html || ''
        const p = Array.from(tmp.querySelectorAll('p')).find(
          el => el.textContent && el.textContent.trim().length > 0
        )
        const text = (p?.textContent || tmp.textContent || '').replace(/\s+/g, ' ').trim()
        return text.split(/\s+/).slice(0, 30).join(' ') + (text.split(/\s+/).length > 30 ? '…' : '')
      }

      return {
        title: `${post.title}${baseTitle}`,
        description: getTextFromHtml(post.details) || `Публикация '${post.title}' ${baseLocation}.`,
        keywords: `публикация, ${post.title}, театр, Владивосток, Балаганчик, ${(post.tags || []).join(', ')}`,
      }
    }

    case 'performance': {
      const performance = data as Performance
      return {
        title: `${performance.title}${baseTitle}`,
        description: performance.description || `Спектакль '${performance.title}' ${baseLocation}.`,
        keywords: `спектакли, спектакль, ${performance.title}, театр, Владивосток, Балаганчик, ${performance.ageGroup || ''}`,
      }
    }

    case 'subsection': {
      const subsection = data as ContentSubsection
      return {
        title: `${subsection.seoTitle || subsection.title} | Лицедей`,
        description: subsection.seoDescription || subsection.title,
        keywords: subsection.seoKeywords || `${parentLabel || 'театр'}, Владивосток`,
      }
    }

    default:
      return {
        title: 'Лицедей',
        description: 'Центр Современного Искусства Лицедей',
        keywords: 'театр, Владивосток',
      }
  }
}

/**
 * Генерация breadcrumbs для разных типов страниц
 */
export const generateBreadcrumbs = (
  type: 'publication' | 'performance' | 'subsection' | 'not-found',
  parentLabel: string,
  itemLabel: string,
  parentPath?: string
): Breadcrumb[] => {
  const baseBreadcrumbs: Breadcrumb[] = [{ label: 'Главная', href: '/' }]

  if (type === 'not-found') {
    return [...baseBreadcrumbs, { label: parentLabel, href: parentPath }, { label: 'Не найдено' }]
  }

  return [...baseBreadcrumbs, { label: parentLabel, href: parentPath }, { label: itemLabel }]
}

/**
 * Генерация контента для 404 страницы
 */
export const generate404Content = (
  type: 'publication' | 'performance' | 'subsection',
  parentPath: string,
  parentLabel: string
) => {
  const messages = {
    publication: {
      title: 'Публикация не найдена — Лицедей',
      description: 'Запрашиваемая публикация не найдена.',
      message: 'Публикация не найдена.',
      buttonText: 'Вернуться к публикациям',
    },
    performance: {
      title: 'Спектакль не найден — Лицедей',
      description: 'Запрашиваемый спектакль не найден.',
      message: 'Спектакль не найден.',
      buttonText: 'Вернуться к спектаклям',
    },
    subsection: {
      title: 'Страница не найдена | Лицедей',
      description: 'Запрашиваемый подраздел не существует',
      message: 'Запрашиваемый подраздел не существует.',
      buttonText: `Вернуться к разделу "${parentLabel}"`,
    },
  }

  return {
    ...messages[type],
    parentPath,
    parentLabel,
  }
}

/**
 * Конвертация breadcrumbs в формат Schema.org
 */
export const convertBreadcrumbsForSEO = (
  breadcrumbs: Breadcrumb[]
): Array<{ name: string; url: string }> => {
  return breadcrumbs
    .filter(item => item.href) // Только элементы с href
    .map(item => ({
      name: item.label,
      url: item.href || '',
    }))
}

/**
 * Генерация полного объекта расширенного SEO для разных типов страниц
 */
export const generateExtendedSEO = (
  type: 'publication' | 'performance' | 'subsection',
  data: Publication | Performance | ContentSubsection
): ExtendedSEO => {
  switch (type) {
    case 'publication': {
      const post = data as Publication
      return {
        type: 'article',
        image: post.image,
        imageAlt: post.title,
        publishedTime: post.date,
        tags: post.tags,
        publication: post,
      }
    }

    case 'performance': {
      const performance = data as Performance
      return {
        image: performance.slider?.[0],
        imageAlt: performance.title,
        performance: performance,
        showLocalBusiness: true,
      }
    }

    case 'subsection': {
      const subsection = data as ContentSubsection
      return {
        image: subsection.gallery?.[0],
        imageAlt: subsection.title,
      }
    }

    default:
      return {}
  }
}
