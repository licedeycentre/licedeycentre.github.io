import { describe, it, expect } from 'vitest'
import { generatePerformanceId, generatePublicationId, transliterate, slugify } from './slugify'

describe('slugify utils', () => {
  describe('transliterate', () => {
    it('transliterates cyrillic text to latin', () => {
      expect(transliterate('Привет')).toBe('Privet')
      expect(transliterate('Спектакль')).toBe('Spektaklь')
      expect(transliterate('Театр')).toBe('Teatr')
    })

    it('handles mixed text', () => {
      expect(transliterate('Театр-студия')).toBe('Teatr-studiya')
      expect(transliterate('Балаганчик')).toBe('Balaganchik')
    })

    it('preserves latin characters', () => {
      expect(transliterate('Hello World')).toBe('Hello World')
      expect(transliterate('Test123')).toBe('Test123')
    })
  })

  describe('slugify', () => {
    it('creates slug from cyrillic text', () => {
      expect(slugify('Спектакль Тест')).toBe('spektakl-test')
      expect(slugify('Театр-студия Балаганчик')).toBe('teatr-studiya-balaganchik')
    })

    it('handles special characters', () => {
      expect(slugify('Спектакль "Тест"')).toBe('spektakl-test')
      expect(slugify('Театр (студия)')).toBe('teatr-studiya')
    })

    it('removes multiple dashes', () => {
      expect(slugify('Театр---студия')).toBe('teatr-studiya')
      expect(slugify('Спектакль   Тест')).toBe('spektakl-test')
    })

    it('handles empty and edge cases', () => {
      expect(slugify('')).toBe('')
      expect(slugify('   ')).toBe('')
      expect(slugify('---')).toBe('')
    })
  })

  describe('generatePerformanceId', () => {
    it('generates performance ID from title', () => {
      expect(generatePerformanceId('Спектакль Тест')).toBe('spektakl-test')
      expect(generatePerformanceId('Театр-студия Балаганчик')).toBe('teatr-studiya-balaganchik')
    })

    it('handles special characters in title', () => {
      expect(generatePerformanceId('Спектакль "Волшебник"')).toBe('spektakl-volshebnik')
      expect(generatePerformanceId('Театр (студия)')).toBe('teatr-studiya')
    })
  })

  describe('generatePublicationId', () => {
    it('generates publication ID with date', () => {
      expect(generatePublicationId('Новость', '2024-01-15')).toBe('2024-01-15-novost')
      expect(generatePublicationId('Статья', '2024-12-25T10:30:00Z')).toBe('2024-12-25-statya')
    })

    it('generates publication ID without date', () => {
      expect(generatePublicationId('Новость')).toBe('novost')
      expect(generatePublicationId('Статья')).toBe('statya')
    })

    it('handles empty date', () => {
      expect(generatePublicationId('Новость', '')).toBe('novost')
      expect(generatePublicationId('Статья', undefined)).toBe('statya')
    })
  })
})
