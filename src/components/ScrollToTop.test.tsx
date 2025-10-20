import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import { ScrollToTop } from '../components/ScrollToTop'

// Мокаем window.scrollTo
const mockScrollTo = vi.fn()
Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
})

describe('ScrollToTop', () => {
  beforeEach(() => {
    mockScrollTo.mockClear()
  })

  it('scrolls to top on initial render', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollToTop />
      </MemoryRouter>
    )

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  })

  it('renders nothing (returns null)', () => {
    const { container } = render(
      <BrowserRouter>
        <ScrollToTop />
      </BrowserRouter>
    )

    expect(container.firstChild).toBeNull()
  })

  it('calls scrollTo with correct parameters', () => {
    render(
      <BrowserRouter>
        <ScrollToTop />
      </BrowserRouter>
    )

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'auto',
    })
  })

  it('works with different router types', () => {
    // Тест с BrowserRouter
    render(
      <BrowserRouter>
        <ScrollToTop />
      </BrowserRouter>
    )
    expect(mockScrollTo).toHaveBeenCalledTimes(1)

    mockScrollTo.mockClear()

    // Тест с MemoryRouter
    render(
      <MemoryRouter initialEntries={['/test']}>
        <ScrollToTop />
      </MemoryRouter>
    )
    expect(mockScrollTo).toHaveBeenCalledTimes(1)
  })

  it('scrolls to top on different routes', () => {
    // Тестируем разные маршруты
    const routes = ['/', '/about', '/contacts', '/performances']

    routes.forEach(route => {
      mockScrollTo.mockClear()
      render(
        <MemoryRouter initialEntries={[route]}>
          <ScrollToTop />
        </MemoryRouter>
      )
      expect(mockScrollTo).toHaveBeenCalledTimes(1)
    })
  })
})
