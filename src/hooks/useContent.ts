import type {
  Publication,
  Performance,
  HeroSlide,
  MediaContent,
  ContactsData,
  AboutData,
  ServicesData,
  LegalPageData,
  SEOData,
  SiteData,
  UILabels,
  PerformanceStatusType,
} from '../types/content'
import { generatePublicationId, generatePerformanceId } from '../utils/slugify'
import { parseDateTimeString } from '../utils/dateFormat'

// Импорты данных
import performancesData from '../content/performances.json'
import publicationsData from '../content/publications.json'
import heroData from '../content/hero.json'
import mediaData from '../content/media.json'
import contactsData from '../content/contacts.json'
import aboutData from '../content/about.json'
import servicesData from '../content/services.json'
import privacyPolicyData from '../content/privacy-policy.json'
import seoData from '../content/seo.json'
import siteData from '../content/site.json'
import uiLabelsData from '../content/ui-labels.json'

// Вспомогательные функции для проверки дат и билетов
const hasFutureDates = (performance: Performance): boolean => {
  if (!performance.showDates || performance.showDates.length === 0) {
    return false
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return performance.showDates.some(dateTimeString => {
    const { date } = parseDateTimeString(dateTimeString)
    const showDate = new Date(date)
    return showDate >= today
  })
}

const hasAnyDates = (performance: Performance): boolean => {
  return !!(performance.showDates && performance.showDates.length > 0)
}

const shouldShowTickets = (performance: Performance): boolean => {
  return !!(performance.tickets && performance.tickets !== 'hide')
}

// Функция для получения ближайшей будущей даты
const getNextShowDate = (performance: Performance): Date | null => {
  if (!performance.showDates || performance.showDates.length === 0) {
    return null
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const futureDates = performance.showDates
    .map(dateTimeString => {
      const { date } = parseDateTimeString(dateTimeString)
      return new Date(date)
    })
    .filter(date => date >= today)
    .sort((a, b) => a.getTime() - b.getTime())

  return futureDates.length > 0 ? futureDates[0] : null
}

// Упрощенная функция для определения приоритета сортировки
const getSortPriority = (performance: Performance): number => {
  const isActive = performance.status === 'active'
  const hasTickets = shouldShowTickets(performance)
  const hasFuture = hasFutureDates(performance)
  const hasDates = hasAnyDates(performance)

  // Архивные всегда в конце
  if (performance.status === 'archived') {
    return 6
  }

  // Активные с прошедшими датами
  if (isActive && hasDates && !hasFuture) {
    return 5
  }

  // Активные с билетами имеют приоритет
  if (isActive && hasTickets) {
    return hasFuture ? 1 : 2 // С датами или без
  }

  // Активные без билетов
  if (isActive) {
    return hasFuture ? 3 : 4 // С датами или без
  }

  return 6 // fallback
}

// Упрощенная функция сортировки спектаклей
const sortPerformances = (performances: Performance[]): Performance[] => {
  return [...performances].sort((a, b) => {
    // 1. Сортировка по приоритету
    const priorityDiff = getSortPriority(a) - getSortPriority(b)
    if (priorityDiff !== 0) {
      return priorityDiff
    }

    // 2. Сортировка по датам (если есть)
    const dateA = getNextShowDate(a)
    const dateB = getNextShowDate(b)

    if (dateA && dateB) {
      return dateA.getTime() - dateB.getTime()
    }

    if (dateA && !dateB) {
      return -1
    }
    if (!dateA && dateB) {
      return 1
    }

    // 3. Сортировка по алфавиту
    return a.title.localeCompare(b.title, 'ru')
  })
}

// Функция для сортировки публикаций по дате (свежие сначала)
const sortPublications = (publications: Publication[]): Publication[] => {
  return [...publications].sort((a, b) => {
    // Если у обеих публикаций есть дата, сортируем по дате (свежие сначала)
    if (a.date && b.date) {
      const dateA = new Date(a.date)
      const dateB = new Date(b.date)
      return dateB.getTime() - dateA.getTime() // По убыванию (свежие сначала)
    }

    // Если дата есть только у одной публикации, она идет первой
    if (a.date && !b.date) {
      return -1
    }
    if (!a.date && b.date) {
      return 1
    }

    // Если дат нет, сортируем по названию
    return a.title.localeCompare(b.title)
  })
}

// Хук для работы с публикациями (отсортированными)
export const usePublications = (): Publication[] => {
  const publications = Array.isArray(publicationsData) ? publicationsData : []
  // Приводим типы для совместимости с JSON
  const typedPublications = publications.map(pub => ({
    ...pub,
    content: '', // BaseContentPage требует content, но для публикаций используется details
    details: pub.details || '',
    buttons: pub.buttons as string[] | undefined,
    documents: pub.documents as Record<string, string> | undefined,
  }))
  return sortPublications(typedPublications)
}

// Хук для работы со спектаклями (отсортированными)
export const usePerformances = (): Performance[] => {
  const performances = Array.isArray(performancesData) ? performancesData : []
  // Приводим типы для совместимости с JSON
  const typedPerformances = performances.map(perf => ({
    ...perf,
    status: perf.status as PerformanceStatusType | undefined,
    showDates: perf.showDates as string[] | undefined,
    cast: perf.cast as Record<string, string[]> | undefined,
  }))
  return sortPerformances(typedPerformances)
}

// Хук для получения отсортированных спектаклей с ограничением количества
export const useSortedPerformances = (limit?: number): Performance[] => {
  const performances = usePerformances()
  return limit ? performances.slice(0, limit) : performances
}

// Хук для получения отсортированных публикаций с ограничением количества
export const useSortedPublications = (limit?: number): Publication[] => {
  const publications = usePublications()
  return limit ? publications.slice(0, limit) : publications
}

// Хук для работы с героем
export const useHeroSlides = (): HeroSlide[] => {
  return Array.isArray(heroData) ? heroData : []
}

// Хук для работы с медиа
export const useMedia = (): MediaContent => {
  return mediaData?.media || {}
}

// Хук для получения конкретной публикации по ID
export const usePublication = (id: string): Publication | undefined => {
  const publications = usePublications()
  return publications.find(p => generatePublicationId(p.title, p.date) === id)
}

// Хук для получения конкретного спектакля по ID
export const usePerformance = (id: string): Performance | undefined => {
  const performances = usePerformances()
  return performances.find(p => generatePerformanceId(p.title) === id)
}

// Хук для работы с контактами
export const useContacts = (): ContactsData => {
  return contactsData || {}
}

// Хук для работы с данными страницы "О нас"
export const useAbout = (): AboutData => {
  return aboutData || {}
}

// Хук для работы с данными страницы "Услуги"
export const useServices = (): ServicesData => {
  const data = servicesData || {}
  return data
}

// Хук для работы с политикой конфиденциальности
export const usePrivacyPolicy = (): LegalPageData => {
  return privacyPolicyData as LegalPageData
}

// Хук для работы с SEO данными
export const useSEO = (): SEOData => {
  return (
    seoData || {
      defaults: {
        siteName: '',
        siteDescription: '',
        siteKeywords: '',
        siteUrl: '',
        logo: '',
        author: '',
        twitterSite: '',
        twitterCreator: '',
      },
      pages: {},
      structuredData: { organization: {} },
    }
  )
}

// Хук для работы с глобальными настройками сайта
export const useSite = (): SiteData => {
  return (
    siteData || {
      footer: { copyright: '', photoConsent: '' },
    }
  )
}

// Хук для работы с UI labels
export const useUILabels = (): UILabels => {
  return uiLabelsData
}
