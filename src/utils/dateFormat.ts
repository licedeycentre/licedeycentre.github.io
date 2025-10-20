// Утилиты для форматирования дат

const monthNames = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

const dayNames = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ']

// Константа для владивостокского часового пояса (UTC+10)
const VLADIVOSTOK_OFFSET_MINUTES = 10 * 60

/**
 * Проверяет валидность даты
 * @param date - объект Date для проверки
 * @returns true, если дата валидна
 */
const isValidDate = (date: Date): boolean => {
  return !isNaN(date.getTime())
}

/**
 * Форматирует дату в формат "11 октября 2024"
 * @param date - дата в ISO формате (например, "2024-10-11")
 * @returns отформатированная строка
 */
export const formatDate = (date: string): string => {
  const dateObj = new Date(date)

  if (!isValidDate(dateObj)) {
    return 'Неверная дата'
  }

  const day = dateObj.getDate()
  const month = monthNames[dateObj.getMonth()]
  const year = dateObj.getFullYear()

  return `${day} ${month} ${year}`
}

/**
 * Форматирует дату последнего показа в формат "11 октября 2023"
 * Алиас для formatDate для семантической ясности
 * @param date - дата в ISO формате
 * @returns отформатированная строка только с датой
 */
export const formatLastShowDate = (date: string): string => {
  return formatDate(date)
}

/**
 * Форматирует дату в формат "11 октября • СБ, 19:00" по владивостокскому времени
 * @param date - дата в ISO формате (например, "2024-10-11")
 * @param time - время в формате "19:00"
 * @returns отформатированная строка
 */
export const formatShowDate = (date: string, time: string): string => {
  const dateTimeString = `${date}T${time}`
  const dateObj = new Date(dateTimeString)

  if (!isValidDate(dateObj)) {
    return 'Неверная дата'
  }

  // Приводим к владивостокскому времени для корректного определения дня недели
  const utc = dateObj.getTime() + dateObj.getTimezoneOffset() * 60000
  const vladivostokDate = new Date(utc + VLADIVOSTOK_OFFSET_MINUTES * 60000)

  const day = vladivostokDate.getDate()
  const month = monthNames[vladivostokDate.getMonth()]
  const dayOfWeek = dayNames[vladivostokDate.getDay()]

  return `${day} ${month} • ${dayOfWeek}, ${time}`
}

/**
 * Форматирует дату в краткий формат "11 окт • СБ, 19:00" по владивостокскому времени
 * @param date - дата в ISO формате
 * @param time - время в формате "19:00"
 * @returns отформатированная строка
 */
export const formatShowDateShort = (date: string, time: string): string => {
  const dateTimeString = `${date}T${time}`
  const dateObj = new Date(dateTimeString)

  if (!isValidDate(dateObj)) {
    return 'Неверная дата'
  }

  // Приводим к владивостокскому времени для корректного определения дня недели
  const utc = dateObj.getTime() + dateObj.getTimezoneOffset() * 60000
  const vladivostokDate = new Date(utc + VLADIVOSTOK_OFFSET_MINUTES * 60000)

  const day = vladivostokDate.getDate()
  const month = monthNames[vladivostokDate.getMonth()].substring(0, 3)
  const dayOfWeek = dayNames[vladivostokDate.getDay()]

  return `${day} ${month} • ${dayOfWeek}, ${time}`
}

/**
 * Получает текущее время во Владивостоке (UTC+10)
 * @returns объект Date с владивостокским временем
 */
export const getVladivostokTime = (): Date => {
  const now = new Date()
  // Владивосток UTC+10
  const utc = now.getTime() + now.getTimezoneOffset() * 60000
  return new Date(utc + VLADIVOSTOK_OFFSET_MINUTES * 60000)
}

/**
 * Проверяет, является ли дата и время будущими по владивостокскому времени
 * @param date - дата в ISO формате
 * @param time - время в формате "19:00" (опционально)
 * @returns true, если дата и время в будущем по владивостокскому времени
 */
export const isFutureDate = (date: string, time?: string): boolean => {
  const dateTimeString = time ? `${date}T${time}` : date
  const dateObj = new Date(dateTimeString)

  if (!isValidDate(dateObj)) {
    return false
  }

  // Приводим дату к владивостокскому времени для корректного сравнения
  const utc = dateObj.getTime() + dateObj.getTimezoneOffset() * 60000
  const vladivostokDateObj = new Date(utc + VLADIVOSTOK_OFFSET_MINUTES * 60000)

  const vladivostokNow = getVladivostokTime()
  return vladivostokDateObj > vladivostokNow
}

/**
 * Сортирует даты показов по возрастанию
 * @param showDates - массив дат показов
 * @returns отсортированный массив
 */
export const sortShowDates = (showDates: Array<{ date: string; time: string }>) => {
  return [...showDates].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)

    // Если одна из дат невалидна, помещаем её в конец
    if (!isValidDate(dateA) && !isValidDate(dateB)) {
      return 0
    }
    if (!isValidDate(dateA)) {
      return 1
    }
    if (!isValidDate(dateB)) {
      return -1
    }

    return dateA.getTime() - dateB.getTime()
  })
}

/**
 * Фильтрует только будущие даты показов
 * @param showDates - массив дат показов
 * @returns массив только будущих дат, отсортированный по возрастанию
 */
export const filterFutureShowDates = (showDates: Array<{ date: string; time: string }>) => {
  return sortShowDates(showDates.filter(showDate => isFutureDate(showDate.date, showDate.time)))
}

/**
 * Получает последнюю прошедшую дату показа
 * @param showDates - массив дат показов
 * @returns последняя прошедшая дата или null, если все даты в будущем
 */
export const getLastPastShowDate = (showDates: Array<{ date: string; time: string }>) => {
  if (!showDates || showDates.length === 0) {
    return null
  }

  // Фильтруем только прошедшие даты (не будущие)
  const pastDates = showDates.filter(showDate => !isFutureDate(showDate.date, showDate.time))

  if (pastDates.length === 0) {
    return null
  }

  // Сортируем и возвращаем последнюю прошедшую дату
  const sortedPastDates = sortShowDates(pastDates)
  return sortedPastDates[sortedPastDates.length - 1]
}
