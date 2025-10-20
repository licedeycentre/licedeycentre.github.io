import React from 'react'

interface NavigationDotsProps {
  count: number
  current: number
  onSelect: (index: number) => void
  variant?: 'hero' | 'gallery' | 'fullscreen'
  className?: string
}

export const NavigationDots: React.FC<NavigationDotsProps> = ({
  count,
  current,
  onSelect,
  variant = 'hero',
  className = '',
}) => {
  if (count <= 1) {
    return null
  }

  return (
    <div className={`nav-dots nav-dots--${variant} ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          className={`nav-dot ${i === current ? 'is-active' : ''}`}
          onClick={() => onSelect(i)}
          aria-label={`Перейти к ${i + 1} из ${count}`}
          type="button"
        />
      ))}
    </div>
  )
}
