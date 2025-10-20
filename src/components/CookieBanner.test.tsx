import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import CookieBanner from '../components/CookieBanner'

// Мокаем localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('CookieBanner', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    vi.clearAllMocks()
  })

  it('renders banner when no consent is given', () => {
    mockLocalStorage.getItem.mockReturnValue(null)

    render(
      <BrowserRouter>
        <CookieBanner />
      </BrowserRouter>
    )

    expect(screen.getByText(/Мы используем cookies/i)).toBeInTheDocument()
    expect(screen.getByText('Принять')).toBeInTheDocument()
  })

  it('does not render banner when consent is already given', () => {
    mockLocalStorage.getItem.mockReturnValue('accepted')

    const { container } = render(
      <BrowserRouter>
        <CookieBanner />
      </BrowserRouter>
    )

    expect(container.firstChild).toBeNull()
  })

  it('hides banner and saves consent when accept button is clicked', () => {
    mockLocalStorage.getItem.mockReturnValue(null)

    const { rerender } = render(
      <BrowserRouter>
        <CookieBanner />
      </BrowserRouter>
    )

    expect(screen.getByText(/Мы используем cookies/i)).toBeInTheDocument()

    const acceptButton = screen.getByText('Принять')
    fireEvent.click(acceptButton)

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('cookieConsent', 'accepted')

    // Перерендериваем компонент чтобы проверить что он скрылся
    mockLocalStorage.getItem.mockReturnValue('accepted')
    rerender(
      <BrowserRouter>
        <CookieBanner />
      </BrowserRouter>
    )

    expect(screen.queryByText(/Мы используем cookies/i)).not.toBeInTheDocument()
  })

  it('renders privacy policy link', () => {
    mockLocalStorage.getItem.mockReturnValue(null)

    render(
      <BrowserRouter>
        <CookieBanner />
      </BrowserRouter>
    )

    const privacyLink = screen.getByText('политикой конфиденциальности')
    expect(privacyLink).toBeInTheDocument()
    expect(privacyLink.closest('a')).toHaveAttribute('href', '/privacy-policy')
  })

  it('handles localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error')
    })

    // Компонент должен не упасть и показать баннер
    render(
      <BrowserRouter>
        <CookieBanner />
      </BrowserRouter>
    )

    expect(screen.getByText(/Мы используем cookies/i)).toBeInTheDocument()
  })

  it('handles setItem errors gracefully', () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage setItem error')
    })

    render(
      <BrowserRouter>
        <CookieBanner />
      </BrowserRouter>
    )

    const acceptButton = screen.getByText('Принять')

    // Клик не должен упасть с ошибкой
    expect(() => fireEvent.click(acceptButton)).not.toThrow()
  })

  it('shows correct cookie consent text', () => {
    mockLocalStorage.getItem.mockReturnValue(null)

    render(
      <BrowserRouter>
        <CookieBanner />
      </BrowserRouter>
    )

    expect(screen.getByText(/Яндекс.Метрику/i)).toBeInTheDocument()
    expect(screen.getByText(/IP-адрес/i)).toBeInTheDocument()
    expect(screen.getByText(/браузер/i)).toBeInTheDocument()
  })

  it('has correct CSS classes', () => {
    mockLocalStorage.getItem.mockReturnValue(null)

    render(
      <BrowserRouter>
        <CookieBanner />
      </BrowserRouter>
    )

    const banner = screen.getByText(/Мы используем cookies/i).closest('.cookie-banner')
    expect(banner).toBeInTheDocument()
  })
})
