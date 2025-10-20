import React from 'react'

/**
 * Обрабатывает HTML-контент, заменяя внутренние ссылки на React Router Link компоненты
 * @param html - HTML строка для обработки
 * @returns JSX элемент с обработанным HTML
 */
export const processHtmlContent = (html: string): JSX.Element => {
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
      onClick={e => {
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
