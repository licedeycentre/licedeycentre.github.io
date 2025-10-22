import React from 'react'
import { useSEO } from '../hooks/useContent'
import { Performance, Publication } from '../types/content'
import {
  generatePerformanceStructuredData,
  generatePublicationStructuredData,
  generateBreadcrumbStructuredData,
  generateLocalBusinessStructuredData,
} from '../utils/structuredData'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  imageAlt?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  structuredData?: Record<string, unknown>
  performance?: Performance
  publication?: Publication
  breadcrumbs?: Array<{ name: string; url: string }>
  showLocalBusiness?: boolean
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  imageAlt,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  structuredData,
  performance,
  publication,
  breadcrumbs,
  showLocalBusiness = false,
}) => {
  const seoData = useSEO()

  // Используем данные из JSON как значения по умолчанию
  const finalTitle = title || seoData.defaults.siteName
  const finalDescription = description || seoData.defaults.siteDescription
  const finalKeywords = keywords || seoData.defaults.siteKeywords
  const finalImage = image || seoData.defaults.logo
  const finalImageAlt = imageAlt || 'Логотип Лицедей - Центр Современного Искусства'
  const finalUrl = url || seoData.defaults.siteUrl
  const finalAuthor = author || seoData.defaults.author

  const fullTitle = finalTitle.includes('Лицедей')
    ? finalTitle
    : `${finalTitle} | ${seoData.defaults.siteName}`
  const fullUrl = finalUrl.startsWith('http') ? finalUrl : `${seoData.defaults.siteUrl}${finalUrl}`
  const fullImage = finalImage.startsWith('http')
    ? finalImage
    : `${seoData.defaults.siteUrl}${finalImage}`

  // Генерируем структурированные данные в зависимости от типа контента
  let finalStructuredData = structuredData || seoData.structuredData.organization

  if (performance) {
    finalStructuredData = generatePerformanceStructuredData(performance, 0)
  } else if (publication) {
    finalStructuredData = generatePublicationStructuredData(publication, 0)
  }

  // Дополнительные структурированные данные
  const additionalStructuredData = []

  if (breadcrumbs && breadcrumbs.length > 0) {
    additionalStructuredData.push(generateBreadcrumbStructuredData(breadcrumbs))
  }


  if (showLocalBusiness) {
    additionalStructuredData.push(generateLocalBusinessStructuredData())
  }

  return (
    <>
      {/* Основные мета-теги */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={finalAuthor} />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

      {/* Дополнительные мета-теги */}
      <meta name="theme-color" content="#1a1a1a" />
      <meta name="msapplication-TileColor" content="#1a1a1a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Лицедей" />

      {/* Геолокация */}
      <meta name="geo.region" content="RU-PRI" />
      <meta name="geo.placename" content="Владивосток" />
      <meta name="geo.position" content="43.105620;131.873530" />
      <meta name="ICBM" content="43.105620, 131.873530" />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph для социальных сетей */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={finalImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={seoData.defaults.siteName} />
      <meta property="og:locale" content="ru_RU" />

      {/* Дополнительные Open Graph теги для статей */}
      {type === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {finalAuthor && <meta property="article:author" content={finalAuthor} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:site" content={seoData.defaults.twitterSite} />
      <meta name="twitter:creator" content={seoData.defaults.twitterCreator} />

      {/* VK метки */}
      <meta property="vk:title" content={fullTitle} />
      <meta property="vk:description" content={finalDescription} />
      <meta property="vk:image" content={fullImage} />

      {/* Telegram метки */}
      <meta property="telegram:title" content={fullTitle} />
      <meta property="telegram:description" content={finalDescription} />
      <meta property="telegram:image" content={fullImage} />

      {/* Структурированные данные JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(finalStructuredData, null, 2),
        }}
      />

      {/* Дополнительные структурированные данные */}
      {additionalStructuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data, null, 2),
          }}
        />
      ))}
    </>
  )
}

export default SEOHead
