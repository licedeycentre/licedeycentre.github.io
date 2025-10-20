/**
 * Утилита для управления блокировкой прокрутки страницы
 * Простая реализация без избыточной сложности
 */

interface ScrollLockState {
  isLocked: boolean
  scrollY: number
}

class ScrollLockManager {
  private state: ScrollLockState = {
    isLocked: false,
    scrollY: 0,
  }

  /**
   * Блокирует прокрутку страницы с сохранением текущей позиции
   */
  lock(): void {
    if (this.state.isLocked) {
      return // Уже заблокировано
    }

    // Сохраняем текущую позицию прокрутки
    this.state.scrollY = window.pageYOffset || document.documentElement.scrollTop

    // Вычисляем ширину скроллбара для предотвращения смещения контента
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    // Применяем стили для блокировки прокрутки
    const body = document.body
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
    if (!this.state.isLocked) {
      return // Уже разблокировано
    }

    // Восстанавливаем стили
    const body = document.body
    body.style.position = ''
    body.style.top = ''
    body.style.left = ''
    body.style.right = ''
    body.style.overflow = ''
    body.style.width = ''
    body.style.paddingRight = ''

    // Восстанавливаем позицию прокрутки
    window.scrollTo(0, this.state.scrollY)

    this.state.isLocked = false
    this.state.scrollY = 0
  }

  /**
   * Проверяет, заблокирована ли прокрутка
   */
  isLocked(): boolean {
    return this.state.isLocked
  }
}

// Создаем единственный экземпляр менеджера
export const scrollLock = new ScrollLockManager()

// Экспортируем типы для использования в других файлах
export type { ScrollLockState }
