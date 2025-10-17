import React from 'react'
import { useSEO } from '../hooks/useContent'

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
  structuredData?: any
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
  structuredData
}) => {
  const seoData = useSEO()
  
  // Используем данные из JSON как значения по умолчанию
  const finalTitle = title || seoData.defaults.siteName
  const finalDescription = description || seoData.defaults.siteDescription
  const finalKeywords = keywords || seoData.defaults.siteKeywords
  const finalImage = image || seoData.defaults.logo
  const finalImageAlt = imageAlt || "Логотип Лицедей - Центр Современного Искусства"
  const finalUrl = url || seoData.defaults.siteUrl
  const finalAuthor = author || seoData.defaults.author
  
  const fullTitle = finalTitle.includes('Лицедей') ? finalTitle : `${finalTitle} | ${seoData.defaults.siteName}`
  const fullUrl = finalUrl.startsWith('http') ? finalUrl : `${seoData.defaults.siteUrl}${finalUrl}`
  const fullImage = finalImage.startsWith('http') ? finalImage : `${seoData.defaults.siteUrl}${finalImage}`

  // Используем структурированные данные из JSON или переданные
  const finalStructuredData = structuredData || seoData.structuredData.organization

  return (
    <>
      {/* Основные мета-теги */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={finalAuthor} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph для социальных сетей */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:alt" content={finalImageAlt} />
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
          __html: JSON.stringify(finalStructuredData, null, 2)
        }}
      />
    </>
  )
}

export default SEOHead
