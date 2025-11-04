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

  // Используем Intl API для корректного форматирования
  const vladivostokDateStr = dateObj.toLocaleString('en-US', {
    timeZone: 'Asia/Vladivostok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })

  const vladivostokDate = new Date(vladivostokDateStr)
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

  // Используем Intl API для корректного форматирования
  const vladivostokDateStr = dateObj.toLocaleString('en-US', {
    timeZone: 'Asia/Vladivostok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  })

  const vladivostokDate = new Date(vladivostokDateStr)
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
  // Используем Intl API для корректной работы с часовым поясом
  const nowStr = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Vladivostok',
  })
  return new Date(nowStr)
}

/**
 * Проверяет, является ли дата и время будущими по владивостокскому времени
 * @param date - дата в ISO формате
 * @param time - время в формате "19:00" (опционально)
 * @returns true, если дата и время в будущем по владивостокскому времени
 */
export const isFutureDate = (date: string, time?: string): boolean => {
  const dateTimeString = time ? `${date}T${time}` : `${date}T00:00`

  // Парсим дату как владивостокское время
  const dateStr = new Date(dateTimeString).toLocaleString('en-US', {
    timeZone: 'Asia/Vladivostok',
  })
  const vladivostokDateObj = new Date(dateStr)

  if (!isValidDate(vladivostokDateObj)) {
    return false
  }

  const vladivostokNow = getVladivostokTime()
  return vladivostokDateObj > vladivostokNow
}

/**
 * Парсит строку даты-времени в формате "2025-12-15 19:00" или "2025-12-15"
 * @param dateTimeString - строка в формате "2025-12-15 19:00" или "2025-12-15"
 * @returns объект {date: "2025-12-15", time: "00:00"} (время по умолчанию 00:00 если не указано)
 */
export const parseDateTimeString = (dateTimeString: string): { date: string; time: string } => {
  // Если строка содержит только дату (без времени)
  if (!dateTimeString.includes(' ')) {
    return {
      date: dateTimeString.trim(),
      time: '00:00', // начало дня вместо 19:00
    }
  }

  // Существующая логика для "2025-01-15 19:00"
  const [date, time] = dateTimeString.split(' ')
  return {
    date: date.trim(),
    time: time.trim(),
  }
}

/**
 * Форматирует строку даты-времени в формат "11 октября • СБ, 19:00"
 * @param dateTimeString - строка в формате "2025-12-15 19:00"
 * @returns отформатированная строка
 */
export const formatDateTimeString = (dateTimeString: string): string => {
  const { date, time } = parseDateTimeString(dateTimeString)
  return formatShowDate(date, time)
}

/**
 * Форматирует строку даты-времени в краткий формат "11 окт • СБ, 19:00"
 * @param dateTimeString - строка в формате "2025-12-15 19:00"
 * @returns отформатированная строка
 */
export const formatDateTimeStringShort = (dateTimeString: string): string => {
  const { date, time } = parseDateTimeString(dateTimeString)
  return formatShowDateShort(date, time)
}

/**
 * Проверяет, является ли строка даты-времени будущей
 * @param dateTimeString - строка в формате "2025-12-15 19:00"
 * @returns true, если дата и время в будущем
 */
export const isFutureDateTimeString = (dateTimeString: string): boolean => {
  const { date, time } = parseDateTimeString(dateTimeString)
  return isFutureDate(date, time)
}

/**
 * Сортирует массив строк дат-времени по возрастанию
 * @param dateTimeStrings - массив строк в формате "2025-12-15 19:00"
 * @returns отсортированный массив
 */
export const sortDateTimeStrings = (dateTimeStrings: string[]): string[] => {
  return [...dateTimeStrings].sort((a, b) => {
    const dateA = new Date(a.replace(' ', 'T'))
    const dateB = new Date(b.replace(' ', 'T'))

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
 * Фильтрует только будущие строки дат-времени
 * @param dateTimeStrings - массив строк в формате "2025-12-15 19:00"
 * @returns массив только будущих дат, отсортированный по возрастанию
 */
export const filterFutureDateTimeStrings = (dateTimeStrings: string[]): string[] => {
  return sortDateTimeStrings(
    dateTimeStrings.filter(dateTimeString => isFutureDateTimeString(dateTimeString))
  )
}

/**
 * Получает последнюю прошедшую строку даты-времени
 * @param dateTimeStrings - массив строк в формате "2025-12-15 19:00"
 * @returns последняя прошедшая дата или null, если все даты в будущем
 */
export const getLastPastDateTimeString = (dateTimeStrings: string[]): string | null => {
  if (!dateTimeStrings || dateTimeStrings.length === 0) {
    return null
  }

  // Фильтруем только прошедшие даты (не будущие)
  const pastDates = dateTimeStrings.filter(
    dateTimeString => !isFutureDateTimeString(dateTimeString)
  )

  if (pastDates.length === 0) {
    return null
  }

  // Сортируем и возвращаем последнюю прошедшую дату
  const sortedPastDates = sortDateTimeStrings(pastDates)
  return sortedPastDates[sortedPastDates.length - 1]
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

/**
 * Форматирует строку даты-времени в полный формат для tooltip "15 декабря 2025, 19:00"
 * @param dateTimeString - строка в формате "2025-12-15 19:00" или "2025-12-15"
 * @returns отформатированная строка с полной датой
 */
export const formatDateTimeStringFull = (dateTimeString: string): string => {
  const { date, time } = parseDateTimeString(dateTimeString)
  const dateObj = new Date(`${date}T${time}`)

  if (!isValidDate(dateObj)) {
    return 'Неверная дата'
  }

  const vladivostokDateStr = dateObj.toLocaleString('en-US', {
    timeZone: 'Asia/Vladivostok',
  })
  const vladivostokDate = new Date(vladivostokDateStr)

  const day = vladivostokDate.getDate()
  const month = monthNames[vladivostokDate.getMonth()]
  const year = vladivostokDate.getFullYear()

  // Если время не было указано в исходной строке (только дата), не показываем время
  if (!dateTimeString.includes(' ')) {
    return `${day} ${month} ${year}`
  }

  return `${day} ${month} ${year}, ${time}`
}
