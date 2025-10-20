import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Footer from '../components/Footer'

// Mock для хуков useContent
vi.mock('../hooks/useContent', () => ({
  useContacts: () => ({
    address: 'Тестовый адрес',
    phones: [{ number: '+7 (123) 456-78-90', href: 'tel:+71234567890' }],
    email: { text: 'test@example.com', href: 'mailto:test@example.com' },
    socials: [{ name: 'Telegram', href: 'https://t.me/test', icon: 'siTelegram' }],
  }),
  useSite: () => ({
    footer: {
      copyright: '© 2024 Лицедей',
      photoConsent: 'Согласие на фото',
    },
  }),
}))

describe('Footer', () => {
  it('renders footer with copyright', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByText(/Лицедей/i)).toBeInTheDocument()
  })

  it('renders contact information', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByText('Тестовый адрес')).toBeInTheDocument()
    expect(screen.getByText('+7 (123) 456-78-90')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders social links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByText('Telegram')).toBeInTheDocument()
  })

  it('renders legal links', () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    )

    expect(screen.getByText('Политика конфиденциальности')).toBeInTheDocument()
  })
})
