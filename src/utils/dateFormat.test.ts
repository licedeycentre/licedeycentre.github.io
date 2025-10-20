import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  formatDate,
  formatLastShowDate,
  formatShowDate,
  formatShowDateShort,
  getVladivostokTime,
  isFutureDate,
  sortShowDates,
  filterFutureShowDates,
  getLastPastShowDate,
} from './dateFormat'

describe('dateFormat utils', () => {
  beforeEach(() => {
    // Мокаем текущее время для стабильных тестов
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('formatDate', () => {
    it('formats valid date correctly', () => {
      expect(formatDate('2024-01-15')).toBe('15 января 2024')
      expect(formatDate('2024-12-25')).toBe('25 декабря 2024')
    })

    it('handles invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Неверная дата')
      expect(formatDate('')).toBe('Неверная дата')
    })

    it('handles edge cases', () => {
      expect(formatDate('2024-02-29')).toBe('29 февраля 2024') // високосный год
      expect(formatDate('2024-01-01')).toBe('1 января 2024')
    })
  })

  describe('formatLastShowDate', () => {
    it('is an alias for formatDate', () => {
      expect(formatLastShowDate('2024-01-15')).toBe('15 января 2024')
      expect(formatLastShowDate('invalid')).toBe('Неверная дата')
    })
  })

  describe('formatShowDate', () => {
    it('formats date with time and day of week', () => {
      expect(formatShowDate('2024-01-15', '19:00')).toBe('15 января • ПН, 19:00')
      expect(formatShowDate('2024-01-20', '14:30')).toBe('20 января • СБ, 14:30')
    })

    it('handles invalid dates', () => {
      expect(formatShowDate('invalid', '19:00')).toBe('Неверная дата')
      expect(formatShowDate('2024-01-15', 'invalid')).toBe('Неверная дата')
    })
  })

  describe('formatShowDateShort', () => {
    it('formats date in short format', () => {
      expect(formatShowDateShort('2024-01-15', '19:00')).toBe('15 янв • ПН, 19:00')
      expect(formatShowDateShort('2024-12-25', '14:30')).toBe('25 дек • СР, 14:30')
    })

    it('handles invalid dates', () => {
      expect(formatShowDateShort('invalid', '19:00')).toBe('Неверная дата')
    })
  })

  describe('getVladivostokTime', () => {
    it('returns current Vladivostok time', () => {
      const vladivostokTime = getVladivostokTime()
      expect(vladivostokTime).toBeInstanceOf(Date)
      // Проверяем что время корректно установлено
      expect(vladivostokTime.getTime()).toBeGreaterThan(0)
    })
  })

  describe('isFutureDate', () => {
    it('correctly identifies future dates', () => {
      // Устанавливаем текущее время на 2024-01-15T12:00:00Z
      expect(isFutureDate('2024-01-16')).toBe(true) // завтра
      expect(isFutureDate('2025-01-15', '14:00')).toBe(true) // будущий год
    })

    it('correctly identifies past dates', () => {
      expect(isFutureDate('2024-01-14')).toBe(false) // вчера
      expect(isFutureDate('2024-01-15', '11:00')).toBe(false) // сегодня, но раньше
    })

    it('handles invalid dates', () => {
      expect(isFutureDate('invalid')).toBe(false)
      expect(isFutureDate('2024-01-15', 'invalid')).toBe(false)
    })
  })

  describe('sortShowDates', () => {
    it('sorts dates in ascending order', () => {
      const dates = [
        { date: '2024-01-20', time: '19:00' },
        { date: '2024-01-15', time: '14:00' },
        { date: '2024-01-18', time: '16:00' },
      ]

      const sorted = sortShowDates(dates)
      expect(sorted[0].date).toBe('2024-01-15')
      expect(sorted[1].date).toBe('2024-01-18')
      expect(sorted[2].date).toBe('2024-01-20')
    })

    it('handles invalid dates by placing them at the end', () => {
      const dates = [
        { date: 'invalid', time: '19:00' },
        { date: '2024-01-15', time: '14:00' },
        { date: '2024-01-20', time: '16:00' },
      ]

      const sorted = sortShowDates(dates)
      expect(sorted[0].date).toBe('2024-01-15')
      expect(sorted[1].date).toBe('2024-01-20')
      expect(sorted[2].date).toBe('invalid')
    })

    it('handles empty array', () => {
      expect(sortShowDates([])).toEqual([])
    })
  })

  describe('filterFutureShowDates', () => {
    it('filters only future dates and sorts them', () => {
      const dates = [
        { date: '2024-01-14', time: '19:00' }, // прошлое
        { date: '2024-01-16', time: '14:00' }, // будущее
        { date: '2024-01-20', time: '16:00' }, // будущее
        { date: '2024-01-15', time: '11:00' }, // прошлое (сегодня, но раньше)
      ]

      const futureDates = filterFutureShowDates(dates)
      expect(futureDates).toHaveLength(2)
      expect(futureDates[0].date).toBe('2024-01-16')
      expect(futureDates[1].date).toBe('2024-01-20')
    })

    it('returns empty array when no future dates', () => {
      const dates = [
        { date: '2024-01-14', time: '19:00' },
        { date: '2024-01-15', time: '11:00' },
      ]

      expect(filterFutureShowDates(dates)).toEqual([])
    })
  })

  describe('getLastPastShowDate', () => {
    it('returns the last past show date', () => {
      const dates = [
        { date: '2024-01-14', time: '19:00' },
        { date: '2024-01-13', time: '14:00' },
        { date: '2024-01-16', time: '16:00' }, // будущее
      ]

      const lastPast = getLastPastShowDate(dates)
      expect(lastPast).toEqual({ date: '2024-01-14', time: '19:00' })
    })

    it('returns null when all dates are in the future', () => {
      const dates = [
        { date: '2024-01-16', time: '19:00' },
        { date: '2024-01-20', time: '14:00' },
      ]

      expect(getLastPastShowDate(dates)).toBeNull()
    })

    it('returns null for empty array', () => {
      expect(getLastPastShowDate([])).toBeNull()
    })

    it('returns null for null/undefined input', () => {
      expect(
        getLastPastShowDate(null as unknown as Array<{ date: string; time: string }>)
      ).toBeNull()
      expect(
        getLastPastShowDate(undefined as unknown as Array<{ date: string; time: string }>)
      ).toBeNull()
    })
  })
})
