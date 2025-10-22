// Тип для группы видео (теперь используется в VideoPlayer)
export interface VideoGroup {
  title: string
  videos: Array<{
    url: string
  }>
}

// Тип для кнопки публикации
export interface PublicationButton {
  text: string
  url: string
}

// Типы для публикаций
export interface Publication {
  title: string
  date?: string
  image: string
  tags: string[]
  html: string
  gallery?: string[]
  video?: PerformanceVideo | VideoGroup[] // Видео публикации (одно видео или группы видео)
  button?: PublicationButton // Кнопка действия (опциональная)
  documents?: Document[] // Документы публикации (опциональные)
}

export interface PublicationsData {
  publications: Publication[]
}

// Типы для спектаклей
export interface ShowDate {
  date: string // ISO формат: "2024-10-11"
  time: string // Формат: "19:00"
}

// Тип для действующих лиц
export interface CastMember {
  role: string // Название роли
  actors: string[] // Массив актёров
  archivedActors?: string[] // Массив архивных актёров (опционально)
}

// Тип для видео спектакля
export interface PerformanceVideo {
  url: string
  title: string
  description: string
}

// Enum для статусов спектаклей
export enum PerformanceStatus {
  UPCOMING = 'upcoming', // Предстоящие (current с будущими датами)
  PLANNED = 'planned', // Планируется в сезоне
  FINISHED = 'finished', // Показ завершён (current с прошедшими датами)
  DEVELOPMENT = 'development', // Созревает к показу
  ARCHIVED_DATED = 'archived_dated', // Архивное с датой (archived с showDates)
  ARCHIVED = 'archived', // Архивное без даты (archived без showDates)
}

// Тип для статуса спектакля в JSON данных
export type PerformanceStatusType = 'current' | 'planned' | 'development' | 'archived'

export interface Performance {
  title: string
  duration: string
  ageGroup: string
  description: string
  detailedDescription?: string // Подробное описание спектакля
  creators: string
  image: string
  slider?: string[] // Изображения для слайдера
  gallery?: string[] // Изображения для галереи внизу страницы
  video?: PerformanceVideo | VideoGroup[] // Видео спектакля (одно видео или группы видео)
  status?: PerformanceStatusType
  showDates?: ShowDate[]
  ticketsUrl?: string // Кастомная ссылка для покупки билетов
  showTicketsButton?: boolean // Показывать ли кнопку "Приобрести билеты"
  documents?: Document[] // Документы спектакля (опциональные)
  castMembers?: CastMember[] // Список действующих лиц
}

export interface PerformancesData {
  performances: Performance[]
}

// Типы для документов
export interface Document {
  title: string
  description: string
  url: string
}

// Типы для героя
export interface HeroButton {
  text: string
  href: string
  primary: boolean
}

export interface HeroSlide {
  title: string
  description: string
  bgUrl?: string
  bgColor?: string
  buttons: HeroButton[]
}

export interface HeroData {
  slides: HeroSlide[]
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
  faq?: FAQItem[]
}

// Типы для страницы "О нас"
export interface AboutDirection {
  icon: string
  title: string
  audience: string
  description: string
  link: string
}

export interface AboutSubsection {
  title: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  content: string
  documents?: Document[]
  video?: PerformanceVideo
  contactButton?: {
    text: string
    href: string
  }
}

export interface AboutData {
  quote: string
  leadText: string
  history: string
  mission: string
  sectionTitles?: {
    history?: string
    mission?: string
    directions?: string
  }
  documents?: Document[]
  gallery?: string[]
  video?: PerformanceVideo
  directions: AboutDirection[]
  subsections?: {
    studio?: AboutSubsection
    inclusive?: AboutSubsection
    theater?: AboutSubsection
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

export interface ServicesSubsection {
  title: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string
  content: string
  video?: PerformanceVideo
  contactButton?: {
    text: string
    href: string
  }
}

export interface ServicesData {
  introText?: string
  sectionTitles?: {
    services?: string
  }
  services?: Service[]
  gallery?: string[]
  video?: PerformanceVideo
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
export interface LegalSection {
  title: string
  content: (string | { type: 'list'; items: string[] })[]
}

export interface LegalPageData {
  title: string
  seo: {
    title: string
    description: string
    keywords: string
  }
  sections: LegalSection[]
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

// Типы для FAQ
export interface FAQItem {
  question: string
  answer: string
}

export interface FAQData {
  faq: FAQItem[]
}

// Типы для глобальных настроек сайта
export interface SiteData {
  organization: {
    name: string
    fullName: string
    shortName: string
  }
  season: {
    current: string
    label: string
  }
  footer: {
    copyright: string
    photoConsent: string
  }
  contacts: {
    mapDescription: string
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
