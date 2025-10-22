import { Performance, Publication } from '../types/content'

export const generatePerformanceStructuredData = (performance: Performance, _index: number) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'TheaterEvent',
    name: performance.title,
    description: performance.description,
    url: `https://licedeycentre.github.io/performances/${performance.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-а-яё]/gi, '')}`,
    image: performance.image,
    startDate: performance.showDates?.[0]
      ? `${performance.showDates[0].date}T${performance.showDates[0].time}:00`
      : undefined,
    endDate: performance.showDates?.[0]
      ? `${performance.showDates[0].date}T${performance.showDates[0].time}:00`
      : undefined,
    eventStatus:
      performance.status === 'current'
        ? 'https://schema.org/EventScheduled'
        : performance.status === 'planned'
          ? 'https://schema.org/EventScheduled'
          : performance.status === 'archived'
            ? 'https://schema.org/EventPostponed'
            : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Лицедей — Центр Современного Искусства',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Бородинская 15 б',
        addressLocality: 'Владивосток',
        addressRegion: 'Приморский край',
        addressCountry: 'RU',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Лицедей — Центр Современного Искусства',
      url: 'https://licedeycentre.github.io',
    },
    performer: {
      '@type': 'TheaterGroup',
      name: 'Театральная студия Балаганчик',
    },
    offers: {
      '@type': 'Offer',
      url: 'https://licedeycentre.github.io/contacts',
      price: '0',
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      validFrom: '2025-01-01',
    },
    audience: {
      '@type': 'Audience',
      audienceType: performance.ageGroup,
    },
    duration: `PT${performance.duration.replace(/\D/g, '')}M`,
  }
}

export const generatePublicationStructuredData = (publication: Publication, _index: number) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: publication.title,
    description: publication.html?.replace(/<[^>]*>/g, '').substring(0, 160) || publication.title,
    url: `https://licedeycentre.github.io/publications/${publication.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-а-яё]/gi, '')}`,
    image: publication.image,
    datePublished: publication.date,
    dateModified: publication.date,
    author: {
      '@type': 'Organization',
      name: 'Лицедей — Центр Современного Искусства',
      url: 'https://licedeycentre.github.io',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Лицедей — Центр Современного Искусства',
      logo: {
        '@type': 'ImageObject',
        url: 'https://licedeycentre.github.io/images/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://licedeycentre.github.io/publications/${publication.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-а-яё]/gi, '')}`,
    },
    keywords: publication.tags?.join(', ') || 'театр, новости, Владивосток',
  }
}

export const generateBreadcrumbStructuredData = (items: Array<{ name: string; url: string }>) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}


export const generateLocalBusinessStructuredData = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Лицедей — Центр Современного Искусства',
    description:
      "Театр‑студия 'Балаганчик' во Владивостоке. Актерское мастерство, сценическая речь, спектакли для детей и взрослых. Аренда зала и театрального оборудования.",
    url: 'https://licedeycentre.github.io',
    telephone: '+7-914-712-69-52',
    email: 'nko.licedey@list.ru',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Бородинская 15 б',
      addressLocality: 'Владивосток',
      addressRegion: 'Приморский край',
      addressCountry: 'RU',
      postalCode: '690000',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '43.105620',
      longitude: '131.873530',
    },
    openingHours: 'Mo-Su 09:00-21:00',
    priceRange: '$$',
    paymentAccepted: 'Cash, Card',
    currenciesAccepted: 'RUB',
    areaServed: {
      '@type': 'City',
      name: 'Владивосток',
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '43.105620',
        longitude: '131.873530',
      },
      geoRadius: '50000',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Услуги театра',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Актерское мастерство',
            description: 'Обучение актерскому мастерству для детей и взрослых',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Аренда зала',
            description: 'Аренда театрального зала для мероприятий',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Театральное оборудование',
            description: 'Аренда театрального оборудования',
          },
        },
      ],
    },
  }
}
