import React from 'react'
import { Link } from 'react-router-dom'

/**
 * Обрабатывает HTML-контент, заменяя внутренние ссылки на React Router Link компоненты
 * @param html - HTML строка для обработки
 * @returns JSX элемент с обработанным HTML
 */
export const processHtmlContent = (html: string): JSX.Element => {
  if (!html) {
    return <div></div>
  }

  // Создаем временный DOM элемент для парсинга HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Находим все внутренние ссылки (начинающиеся с /)
  const internalLinks = tempDiv.querySelectorAll('a[href^="/"]')
  
  internalLinks.forEach((link) => {
    const href = link.getAttribute('href')
    if (href && href.startsWith('/')) {
      // Заменяем href на data-router-href для последующей обработки
      link.setAttribute('data-router-href', href)
      link.removeAttribute('href')
    }
  })

  // Получаем обработанный HTML
  const processedHtml = tempDiv.innerHTML

  // Функция для рендеринга обработанного HTML с поддержкой React Router
  const renderProcessedHtml = (htmlString: string) => {
    const parts: (string | JSX.Element)[] = []
    let currentIndex = 0

    // Регулярное выражение для поиска ссылок с data-router-href
    const linkRegex = /<a([^>]*?)data-router-href="([^"]*?)"([^>]*?)>(.*?)<\/a>/g
    let match

    while ((match = linkRegex.exec(htmlString)) !== null) {
      // Добавляем текст до ссылки
      if (match.index > currentIndex) {
        parts.push(htmlString.slice(currentIndex, match.index))
      }

      // Извлекаем атрибуты и содержимое ссылки
      const beforeHref = match[1]
      const href = match[2]
      const afterHref = match[3]
      const content = match[4]

      // Собираем все атрибуты кроме data-router-href
      const attributes = `${beforeHref}${afterHref}`.trim()
      
      // Создаем React Router Link
      const linkElement = React.createElement(
        Link,
        {
          to: href,
          dangerouslySetInnerHTML: { __html: content },
          ...(attributes ? { className: attributes.match(/class="([^"]*?)"/)?.[1] } : {})
        }
      )

      parts.push(linkElement)
      currentIndex = match.index + match[0].length
    }

    // Добавляем оставшийся текст
    if (currentIndex < htmlString.length) {
      parts.push(htmlString.slice(currentIndex))
    }

    return parts.length > 0 ? parts : [htmlString]
  }

  return (
    <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
  )
}

/**
 * Простая версия обработки HTML без сложной логики замены ссылок
 * Просто заменяет внутренние ссылки на кликабельные элементы с обработчиком
 */
export const processHtmlContentSimple = (html: string): JSX.Element => {
  if (!html) {
    return <div></div>
  }

  // Заменяем внутренние ссылки на специальные маркеры
  const processedHtml = html.replace(
    /<a([^>]*?)href="(\/[^"]*?)"([^>]*?)>(.*?)<\/a>/g,
    (match, beforeHref, href, afterHref, content) => {
      // Извлекаем классы
      const classMatch = beforeHref.match(/class="([^"]*?)"/) || afterHref.match(/class="([^"]*?)"/)
      const className = classMatch ? classMatch[1] : ''
      
      return `<span class="internal-link ${className}" data-href="${href}">${content}</span>`
    }
  )

  return (
    <div 
      dangerouslySetInnerHTML={{ __html: processedHtml }}
      onClick={(e) => {
        const target = e.target as HTMLElement
        const internalLink = target.closest('.internal-link')
        if (internalLink) {
          const href = internalLink.getAttribute('data-href')
          if (href) {
            e.preventDefault()
            // Используем window.location для навигации (это будет работать с React Router)
            window.history.pushState(null, '', href)
            window.dispatchEvent(new PopStateEvent('popstate'))
          }
        }
      }}
    />
  )
}
