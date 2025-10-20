import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { scrollLock } from './scrollLock'

// Мокаем DOM API
const mockScrollTo = vi.fn()

Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

Object.defineProperty(window, 'pageYOffset', {
  value: 100,
  writable: true,
})

Object.defineProperty(document.documentElement, 'scrollTop', {
  value: 100,
  writable: true,
})

Object.defineProperty(window, 'innerWidth', {
  value: 1200,
  writable: true,
})

Object.defineProperty(document.documentElement, 'clientWidth', {
  value: 1180,
  writable: true,
})

describe('scrollLock', () => {
  beforeEach(() => {
    // Очищаем DOM перед каждым тестом
    document.body.style.cssText = ''
    mockScrollTo.mockClear()

    // Разблокируем прокрутку если она была заблокирована
    if (scrollLock.isLocked()) {
      scrollLock.unlock()
    }
  })

  afterEach(() => {
    // Убеждаемся что прокрутка разблокирована после теста
    if (scrollLock.isLocked()) {
      scrollLock.unlock()
    }
  })

  describe('lock', () => {
    it('locks scroll and applies styles', () => {
      expect(scrollLock.isLocked()).toBe(false)

      scrollLock.lock()

      expect(scrollLock.isLocked()).toBe(true)
      expect(document.body.style.position).toBe('fixed')
      expect(document.body.style.top).toBe('-100px')
      expect(document.body.style.left).toBe('0px')
      expect(document.body.style.right).toBe('0px')
      expect(document.body.style.overflow).toBe('hidden')
      expect(document.body.style.width).toBe('100%')
      expect(document.body.style.paddingRight).toBe('20px') // scrollbar width
    })

    it('does not lock if already locked', () => {
      scrollLock.lock()
      const firstLockStyles = document.body.style.cssText

      scrollLock.lock() // второй вызов

      expect(document.body.style.cssText).toBe(firstLockStyles)
      expect(scrollLock.isLocked()).toBe(true)
    })

    it('handles zero scroll position', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 0, writable: true })

      scrollLock.lock()

      expect(document.body.style.top).toBe('0px')
    })
  })

  describe('unlock', () => {
    it('unlocks scroll and restores styles', () => {
      scrollLock.lock()
      expect(scrollLock.isLocked()).toBe(true)

      scrollLock.unlock()

      expect(scrollLock.isLocked()).toBe(false)
      expect(document.body.style.position).toBe('')
      expect(document.body.style.top).toBe('')
      expect(document.body.style.left).toBe('')
      expect(document.body.style.right).toBe('')
      expect(document.body.style.overflow).toBe('')
      expect(document.body.style.width).toBe('')
      expect(document.body.style.paddingRight).toBe('')
      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
    })

    it('does not unlock if not locked', () => {
      expect(scrollLock.isLocked()).toBe(false)

      scrollLock.unlock()

      expect(scrollLock.isLocked()).toBe(false)
      expect(mockScrollTo).not.toHaveBeenCalled()
    })

    it('resets scroll position after unlock', () => {
      scrollLock.lock()
      scrollLock.unlock()

      expect(mockScrollTo).toHaveBeenCalledWith(0, 0)
    })
  })

  describe('isLocked', () => {
    it('returns correct lock status', () => {
      expect(scrollLock.isLocked()).toBe(false)

      scrollLock.lock()
      expect(scrollLock.isLocked()).toBe(true)

      scrollLock.unlock()
      expect(scrollLock.isLocked()).toBe(false)
    })
  })

  describe('integration', () => {
    it('can lock and unlock multiple times', () => {
      // Первый цикл
      scrollLock.lock()
      expect(scrollLock.isLocked()).toBe(true)

      scrollLock.unlock()
      expect(scrollLock.isLocked()).toBe(false)

      // Второй цикл
      scrollLock.lock()
      expect(scrollLock.isLocked()).toBe(true)

      scrollLock.unlock()
      expect(scrollLock.isLocked()).toBe(false)

      expect(mockScrollTo).toHaveBeenCalledTimes(2)
    })

    it('preserves scroll position across lock/unlock cycles', () => {
      Object.defineProperty(window, 'pageYOffset', { value: 250, writable: true })
      Object.defineProperty(document.documentElement, 'scrollTop', { value: 250, writable: true })

      scrollLock.lock()
      expect(document.body.style.top).toBe('-250px')

      scrollLock.unlock()
      expect(mockScrollTo).toHaveBeenCalledWith(0, 250)
    })
  })
})
