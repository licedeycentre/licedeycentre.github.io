import React, { useEffect, useState } from 'react'
import { scrollLock } from '../utils/scrollLock'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Управление анимациями
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Небольшая задержка для корректного запуска анимации
      requestAnimationFrame(() => {
        setIsAnimating(true)
      })
    } else {
      setIsAnimating(false)
      // Ждем завершения анимации перед скрытием
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 200) // Длительность анимации закрытия

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Блокируем прокрутку страницы при открытом модальном окне
  useEffect(() => {
    if (isVisible) {
      scrollLock.lock()
    } else {
      scrollLock.unlock()
    }

    // Очищаем состояние при размонтировании
    return () => {
      scrollLock.unlock()
    }
  }, [isVisible])

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onClose()
      }
    }

    if (isVisible) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isVisible, onClose])

  if (!isVisible) {
    return null
  }

  return (
    <div
      className={`modal-overlay ${isAnimating ? 'modal-overlay--open' : 'modal-overlay--closed'} ${className}`}
      onClick={onClose}
    >
      <div
        className={`modal-content ${isAnimating ? 'modal-content--open' : 'modal-content--closed'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Заголовок */}
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button className="modal-close" onClick={onClose} aria-label="Закрыть">
              ×
            </button>
          </div>
        )}

        {/* Описание */}
        {description && <div className="modal-description">{description}</div>}

        {/* Контент */}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal
