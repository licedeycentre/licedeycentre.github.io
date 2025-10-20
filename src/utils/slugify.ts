/**
 * Утилиты для транслитерации и генерации slug
 */

// Таблица транслитерации кириллицы в латиницу
const transliterationMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',

  // Заглавные буквы
  А: 'A',
  Б: 'B',
  В: 'V',
  Г: 'G',
  Д: 'D',
  Е: 'E',
  Ё: 'Yo',
  Ж: 'Zh',
  З: 'Z',
  И: 'I',
  Й: 'Y',
  К: 'K',
  Л: 'L',
  М: 'M',
  Н: 'N',
  О: 'O',
  П: 'P',
  Р: 'R',
  С: 'S',
  Т: 'T',
  У: 'U',
  Ф: 'F',
  Х: 'Kh',
  Ц: 'Ts',
  Ч: 'Ch',
  Ш: 'Sh',
  Щ: 'Shch',
  Ъ: '',
  Ы: 'Y',
  Ь: '',
  Э: 'E',
  Ю: 'Yu',
  Я: 'Ya',
}

/**
 * Транслитерирует кириллический текст в латиницу
 */
export function transliterate(text: string): string {
  return text
    .split('')
    .map(char => transliterationMap[char] || char)
    .join('')
}

/**
 * Создает slug из текста (нижний регистр, дефисы вместо пробелов и спецсимволов)
 */
export function slugify(text: string): string {
  return transliterate(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Удаляем все кроме букв, цифр, пробелов и дефисов
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Убираем множественные дефисы
    .replace(/^-|-$/g, '') // Убираем дефисы в начале и конце
}

/**
 * Генерирует ID для публикации на основе даты и заголовка
 * Формат: YYYY-MM-DD-slugified-title
 */
export function generatePublicationId(title: string, date?: string): string {
  const titleSlug = slugify(title)

  if (date) {
    // Форматируем дату в YYYY-MM-DD
    const formattedDate = date.includes('-') ? date.split('T')[0] : date
    return `${formattedDate}-${titleSlug}`
  }

  return titleSlug
}

/**
 * Генерирует ID для спектакля на основе заголовка
 * Формат: slugified-title
 */
export function generatePerformanceId(title: string): string {
  return slugify(title)
}

/**
 * Генерирует ID для элемента с учетом дубликатов
 * При дубликатах последний перезаписывает предыдущий
 */
export function generateUniqueId<T extends { title: string; date?: string }>(
  items: T[],
  generator: (title: string, date?: string) => string
): string {
  const usedIds = new Set<string>()

  // Проходим по всем элементам и собираем используемые ID
  items.forEach(item => {
    const id = generator(item.title, item.date)
    usedIds.add(id)
  })

  // Возвращаем ID последнего элемента (он перезапишет предыдущие)
  const lastItem = items[items.length - 1]
  return generator(lastItem.title, lastItem.date)
}
