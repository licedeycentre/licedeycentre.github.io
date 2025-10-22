import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FAQAccordion } from './FAQAccordion'

const mockFAQItems = [
  {
    question: 'Как записаться в театр?',
    answer: 'Позвоните по телефону или напишите нам',
  },
  {
    question: 'Какой возраст принимаем?',
    answer: 'Принимаем детей от 7 до 17 лет',
  },
  {
    question: 'Сколько стоят занятия?',
    answer: 'Первое занятие бесплатное',
  },
]

describe('FAQAccordion', () => {
  it('renders all FAQ items', () => {
    render(<FAQAccordion items={mockFAQItems} />)

    expect(screen.getByText('Как записаться в театр?')).toBeInTheDocument()
    expect(screen.getByText('Какой возраст принимаем?')).toBeInTheDocument()
    expect(screen.getByText('Сколько стоят занятия?')).toBeInTheDocument()
  })

  it('all items are closed by default', () => {
    render(<FAQAccordion items={mockFAQItems} />)

    const buttons = screen.getAllByRole('button')
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
  })

  it('opens item when clicked', () => {
    render(<FAQAccordion items={mockFAQItems} />)

    const firstQuestion = screen.getByText('Как записаться в театр?')
    const button = firstQuestion.closest('button')!

    fireEvent.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Позвоните по телефону или напишите нам')).toBeInTheDocument()
  })

  it('closes item when clicked again', () => {
    render(<FAQAccordion items={mockFAQItems} />)

    const firstQuestion = screen.getByText('Как записаться в театр?')
    const button = firstQuestion.closest('button')!

    // Открываем
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')

    // Закрываем
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('only one item can be open at a time', () => {
    render(<FAQAccordion items={mockFAQItems} />)

    const firstButton = screen.getByText('Как записаться в театр?').closest('button')!
    const secondButton = screen.getByText('Какой возраст принимаем?').closest('button')!

    // Открываем первый
    fireEvent.click(firstButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'true')
    expect(secondButton).toHaveAttribute('aria-expanded', 'false')

    // Открываем второй
    fireEvent.click(secondButton)
    expect(firstButton).toHaveAttribute('aria-expanded', 'false')
    expect(secondButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('applies correct CSS classes when open', () => {
    render(<FAQAccordion items={mockFAQItems} />)

    const firstQuestion = screen.getByText('Как записаться в театр?')
    const button = firstQuestion.closest('button')!
    const faqItem = button.parentElement!

    expect(faqItem).toHaveClass('faq-item')
    expect(faqItem).not.toHaveClass('faq-item--open')

    fireEvent.click(button)

    expect(faqItem).toHaveClass('faq-item--open')
  })

  it('has correct aria attributes', () => {
    render(<FAQAccordion items={mockFAQItems} />)

    const buttons = screen.getAllByRole('button')

    // Проверяем что у нас есть правильное количество кнопок
    expect(buttons).toHaveLength(3)

    // Проверяем атрибуты для каждой кнопки
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded')
      expect(button).toHaveAttribute('type', 'button')

      // Проверяем что aria-controls указывает на существующий элемент
      const controlsId = button.getAttribute('aria-controls')
      expect(controlsId).toMatch(/^faq-answer-\d+$/)
      expect(document.getElementById(controlsId!)).toBeInTheDocument()
    })
  })

  it('answer sections have correct aria-hidden attribute', () => {
    render(<FAQAccordion items={mockFAQItems} />)

    const firstButton = screen.getByText('Как записаться в театр?').closest('button')!
    const answerSection = document.getElementById('faq-answer-0')

    expect(answerSection).toHaveAttribute('aria-hidden', 'true')

    fireEvent.click(firstButton)

    expect(answerSection).toHaveAttribute('aria-hidden', 'false')
  })

  it('renders with empty items array', () => {
    const { container } = render(<FAQAccordion items={[]} />)

    expect(container.querySelector('.faq-list')).toBeInTheDocument()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
