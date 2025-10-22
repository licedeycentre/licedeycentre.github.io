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
import { PerformanceStatus } from '../types/content'
import { generatePublicationId, generatePerformanceId } from '../utils/slugify'

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

// Функция для определения статуса спектакля
const getPerformanceStatus = (performance: Performance): PerformanceStatus => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Если есть status, используем его для обратной совместимости
  if (performance.status) {
    if (performance.status === 'current') {
      // Проверяем даты показов
      if (performance.showDates && performance.showDates.length > 0) {
        const hasFutureDates = performance.showDates.some(showDate => {
          const showDateObj = new Date(showDate.date)
          return showDateObj >= today
        })
        return hasFutureDates ? PerformanceStatus.UPCOMING : PerformanceStatus.FINISHED
      }
      return PerformanceStatus.FINISHED
    }

    if (performance.status === 'planned') {
      return PerformanceStatus.PLANNED
    }

    if (performance.status === 'development') {
      return PerformanceStatus.DEVELOPMENT
    }

    if (performance.status === 'archived') {
      return performance.showDates && performance.showDates.length > 0
        ? PerformanceStatus.ARCHIVED_DATED
        : PerformanceStatus.ARCHIVED
    }
  }

  // Fallback для случаев без status
  return PerformanceStatus.ARCHIVED
}

// Функция для получения релевантной даты спектакля для сортировки
const getRelevantShowDate = (performance: Performance): Date | null => {
  if (!performance.showDates || performance.showDates.length === 0) {
    return null
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  // Для текущих спектаклей ищем ближайшую будущую дату
  if (performance.status === 'current') {
    const futureDates = performance.showDates
      .map(showDate => new Date(showDate.date))
      .filter(date => date >= today)
      .sort((a, b) => a.getTime() - b.getTime())

    return futureDates.length > 0 ? futureDates[0] : null
  }

  // Для архивных спектаклей берем последнюю дату показа
  if (performance.status === 'archived') {
    const allDates = performance.showDates
      .map(showDate => new Date(showDate.date))
      .sort((a, b) => b.getTime() - a.getTime()) // Сортируем по убыванию

    return allDates.length > 0 ? allDates[0] : null
  }

  // Для планируемых спектаклей берем первую дату (если есть)
  if (performance.status === 'planned') {
    const allDates = performance.showDates
      .map(showDate => new Date(showDate.date))
      .sort((a, b) => a.getTime() - b.getTime())

    return allDates.length > 0 ? allDates[0] : null
  }

  return null
}

// Функция для сортировки спектаклей по приоритету статусов и датам
const sortPerformances = (performances: Performance[]): Performance[] => {
  const statusPriority = {
    [PerformanceStatus.UPCOMING]: 1,
    [PerformanceStatus.PLANNED]: 2,
    [PerformanceStatus.DEVELOPMENT]: 3,
    [PerformanceStatus.FINISHED]: 4,
    [PerformanceStatus.ARCHIVED_DATED]: 5,
    [PerformanceStatus.ARCHIVED]: 6,
  }

  return [...performances].sort((a, b) => {
    const statusA = getPerformanceStatus(a)
    const statusB = getPerformanceStatus(b)

    // Сначала сортируем по статусу
    const priorityDiff = statusPriority[statusA] - statusPriority[statusB]
    if (priorityDiff !== 0) {
      return priorityDiff
    }

    // Если статусы одинаковые, сортируем по релевантной дате
    const dateA = getRelevantShowDate(a)
    const dateB = getRelevantShowDate(b)

    if (dateA && dateB) {
      return dateA.getTime() - dateB.getTime()
    }

    if (dateA && !dateB) {
      return -1
    }
    if (!dateA && dateB) {
      return 1
    }

    // Если дат нет, сортируем по названию
    return a.title.localeCompare(b.title)
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
  const publications = Array.isArray(publicationsData?.publications)
    ? publicationsData.publications
    : []
  return sortPublications(publications)
}

// Хук для работы со спектаклями (отсортированными)
export const usePerformances = (): Performance[] => {
  const performances = Array.isArray(performancesData?.performances)
    ? performancesData.performances
    : []
  // Приводим типы для совместимости с JSON
  const typedPerformances = performances.map(perf => ({
    ...perf,
    status: perf.status as PerformanceStatusType | undefined,
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
  return Array.isArray(heroData?.slides) ? heroData.slides : []
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
      organization: { name: '', fullName: '', shortName: '' },
      season: { current: '', label: '' },
      footer: { copyright: '', photoConsent: '' },
      contacts: { mapDescription: '' },
    }
  )
}

// Хук для работы с UI labels
export const useUILabels = (): UILabels => {
  return uiLabelsData
}
