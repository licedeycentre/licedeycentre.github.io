// Тип для группы видео (теперь используется в VideoPlayer)
export interface VideoGroup {
  title: string
  videos: Array<{
    url: string
  }>
}

// Тип для кнопки публикации - теперь просто URL
export type PublicationButton = string

// Типы для публикаций
export interface Publication extends BaseContentPage {
  date?: string
  image: string
  tags: string[]
  details: string // Переопределяем content из BaseContentPage
  buttons?: string[] // Формат: ["текст:ссылка", "текст:ссылка"]
}

// Типы для спектаклей
export type ShowDates = string[] // Массив строк в формате "2025-12-15 19:00"

// Тип для действующих лиц - объект с ключами-ролями
// Архивные актеры помечаются префиксом "*"
export type Cast = Record<string, string[]> // {"Роль": ["Актер1", "*Архивный актер"]}

// Тип для статуса спектакля в JSON данных
export type PerformanceStatusType = 'active' | 'archived'

export interface Performance extends BaseContentPage {
  duration: string
  ageGroup: string
  genre?: string // Жанр спектакля (опциональное поле)
  description: string
  details?: string // Подробное описание спектакля
  creators: string
  slider?: string[] // Изображения для слайдера
  status?: PerformanceStatusType
  showDates?: ShowDates
  tickets?: string // "show" | "hide" | URL для покупки билетов
  cast?: Cast // Список действующих лиц
}

// Типы для документов - объект с ключами-названиями
export type Documents = Record<string, string>

// Типы для героя
export interface HeroSlide {
  title: string
  description: string
  bgUrl?: string
  buttons?: string[] // Формат: ["текст:ссылка", "текст:ссылка"]
}

// Типы для медиа
export interface MediaContent {
  logo?: string
  hero?: {
    slide1?: string
    slide2?: string
  }
  performances?: {
    pustocvet?: string
    default?: string
  }
  videos?: {
    promo?: string
    backstage?: string
  }
  about?: {
    team?: string
    studio?: string
  }
}

export interface MediaData {
  media: MediaContent
}

// Типы для контактов
export interface ContactPhone {
  number: string
  href: string
  telegram?: string
  whatsapp?: string
}

export interface ContactEmail {
  text: string
  href: string
}

export interface ContactSocial {
  name: string
  href: string
  icon: string
}

export interface ContactsData {
  address: string
  addressDetails?: string
  phones: ContactPhone[]
  email: ContactEmail
  socials: ContactSocial[]
  mapUrl?: string
  feedbackFormUrl?: string
}

// Базовый тип для всех контентных страниц
export interface BaseContentPage {
  title: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  content: string
  video?: string | string[]
  gallery?: string[]
  documents?: Documents
  contactButton?: {
    text: string
    href: string
  }
}

// Типы для страницы "О нас"
export interface AboutDirection {
  icon: string
  title: string
  audience: string
  description: string
  link: string
}

export interface ContentSubsection extends BaseContentPage {
  // Дополнительные поля для подразделов можно добавить здесь при необходимости
}

export interface AboutData {
  quote: string
  leadText: string
  history: string
  mission: string
  documents?: Documents
  gallery?: string[]
  video?: string
  directions: AboutDirection[]
  subsections?: {
    studio?: ContentSubsection
    inclusive?: ContentSubsection
    theater?: ContentSubsection
    'summer-camp'?: ContentSubsection
  }
  contactButton?: {
    text: string
    href: string
  }
}

// Типы для раздела "Услуги"
export interface Service {
  icon: string
  title: string
  audience: string
  description: string
  link: string
}

export interface ServicesSubsection extends ContentSubsection {
  // Дополнительные поля для услуг можно добавить здесь при необходимости
}

export interface ServicesData {
  introText?: string
  services?: Service[]
  gallery?: string[]
  video?: string
  subsections?: {
    performances?: ServicesSubsection
    hall?: ServicesSubsection
    equipment?: ServicesSubsection
  }
  contactButton?: {
    text: string
    href: string
  }
}

// Типы для юридических страниц
export interface LegalPageData {
  title: string
  seo: {
    title: string
    description: string
    keywords: string
  }
  content: string
}

// Типы для SEO данных
export interface SEOData {
  defaults: {
    siteName: string
    siteDescription: string
    siteKeywords: string
    siteUrl: string
    logo: string
    author: string
    twitterSite: string
    twitterCreator: string
  }
  pages: {
    [key: string]: {
      title: string
      description: string
      keywords: string
    }
  }
  structuredData: {
    organization: Record<string, unknown>
  }
}

// Типы для глобальных настроек сайта
export interface SiteData {
  footer: {
    copyright: string
    photoConsent: string
  }
}

// Типы для UI labels
export interface UILabels {
  common: {
    readMore: string
    download: string
    preview: string
  }
  navigation: {
    main: string
    about: string
    services: string
    contacts: string
    publications: string
    performances: string
  }
  sections: {
    video: string
    documents: string
  }
  buttons: {
    showArchivedActors: string
    hideArchivedActors: string
  }
  footer: {
    addressTitle: string
    phonesTitle: string
    emailTitle: string
    socialTitle: string
  }
  ariaLabels: {
    mainNavigation: string
    socialNetworks: string
    openMenu: string
    closeMenu: string
    toHome: string
    aboutSubmenu: string
    servicesSubmenu: string
  }
  cookies: {
    title: string
    description: string
    privacyPolicy: string
    accept: string
    decline: string
  }
}
