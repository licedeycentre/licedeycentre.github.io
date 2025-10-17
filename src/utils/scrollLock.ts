/**
 * Утилита для управления блокировкой прокрутки страницы
 * Решает проблемы с зависанием прокрутки на мобильных устройствах
 */

interface ScrollLockState {
  isLocked: boolean
  scrollY: number
  lockCount: number
  originalStyle: {
    position: string
    top: string
    left: string
    right: string
    overflow: string
    width: string
    paddingRight: string
  }
}

class ScrollLockManager {
  private state: ScrollLockState = {
    isLocked: false,
    scrollY: 0,
    lockCount: 0,
    originalStyle: {
      position: '',
      top: '',
      left: '',
      right: '',
      overflow: '',
      width: '',
      paddingRight: ''
    }
  }

  /**
   * Блокирует прокрутку страницы с сохранением текущей позиции
   */
  lock(): void {
    this.state.lockCount++
    
    if (this.state.isLocked) {
      return // Уже заблокировано
    }

    // Сохраняем текущую позицию прокрутки
    this.state.scrollY = window.pageYOffset || document.documentElement.scrollTop
    
    // Сохраняем оригинальные стили
    const body = document.body
    this.state.originalStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
      width: body.style.width,
      paddingRight: body.style.paddingRight
    }
    
    // Вычисляем ширину скроллбара для предотвращения смещения контента
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    
    // Применяем стили для блокировки прокрутки
    body.style.position = 'fixed'
    body.style.top = `-${this.state.scrollY}px`
    body.style.left = '0'
    body.style.right = '0'
    body.style.overflow = 'hidden'
    body.style.width = '100%'
    body.style.paddingRight = `${scrollbarWidth}px`
    
    this.state.isLocked = true
  }

  /**
   * Разблокирует прокрутку страницы с восстановлением позиции
   */
  unlock(): void {
    if (this.state.lockCount > 0) {
      this.state.lockCount--
    }
    
    if (this.state.lockCount > 0 || !this.state.isLocked) {
      return // Есть другие блокировки или уже разблокировано
    }

    // Восстанавливаем оригинальные стили
    const body = document.body
    body.style.position = this.state.originalStyle.position
    body.style.top = this.state.originalStyle.top
    body.style.left = this.state.originalStyle.left
    body.style.right = this.state.originalStyle.right
    body.style.overflow = this.state.originalStyle.overflow
    body.style.width = this.state.originalStyle.width
    body.style.paddingRight = this.state.originalStyle.paddingRight
    
    // Восстанавливаем позицию прокрутки
    window.scrollTo(0, this.state.scrollY)
    
    this.state.isLocked = false
    this.state.scrollY = 0
  }

  /**
   * Принудительно разблокирует прокрутку (сбрасывает счетчик)
   * Используется при очистке состояния
   */
  forceUnlock(): void {
    this.state.lockCount = 0
    
    if (this.state.isLocked) {
      // Восстанавливаем оригинальные стили
      const body = document.body
      body.style.position = this.state.originalStyle.position
      body.style.top = this.state.originalStyle.top
      body.style.left = this.state.originalStyle.left
      body.style.right = this.state.originalStyle.right
      body.style.overflow = this.state.originalStyle.overflow
      body.style.width = this.state.originalStyle.width
      body.style.paddingRight = this.state.originalStyle.paddingRight
      
      // Восстанавливаем позицию прокрутки
      window.scrollTo(0, this.state.scrollY)
      
      this.state.isLocked = false
      this.state.scrollY = 0
    }
  }

  /**
   * Проверяет, заблокирована ли прокрутка
   */
  isLocked(): boolean {
    return this.state.isLocked
  }

  /**
   * Получает количество активных блокировок
   */
  getLockCount(): number {
    return this.state.lockCount
  }
}

// Создаем единственный экземпляр менеджера
export const scrollLock = new ScrollLockManager()

// Экспортируем типы для использования в других файлах
export type { ScrollLockState }
