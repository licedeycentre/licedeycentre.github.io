import React from 'react'

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

export const FAQAccordion: React.FC<FAQAccordionProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null)
  const contentRefs = React.useRef<(HTMLDivElement | null)[]>([])
  const bodyRefs = React.useRef<(HTMLDivElement | null)[]>([])

  // Инициализируем refs для всех элементов
  React.useEffect(() => {
    contentRefs.current = contentRefs.current.slice(0, items.length)
    bodyRefs.current = bodyRefs.current.slice(0, items.length)
  }, [items.length])

  const toggleItem = (index: number) => {
    if (openIndex === index) {
      // Закрываем текущий элемент
      setOpenIndex(null)
    } else {
      // Открываем новый элемент
      setOpenIndex(index)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleItem(index)
    }
  }

  // Устанавливаем высоту контента для анимации
  React.useEffect(() => {
    // Сначала закрываем все элементы
    contentRefs.current.forEach(ref => {
      if (ref) {
        ref.style.height = '0px'
      }
    })

    // Затем открываем нужный элемент (если есть)
    if (openIndex !== null) {
      const contentRef = contentRefs.current[openIndex]
      const bodyRef = bodyRefs.current[openIndex]

      if (contentRef && bodyRef) {
        // Небольшая задержка для плавного переключения
        setTimeout(() => {
          const contentHeight = bodyRef.scrollHeight
          contentRef.style.height = `${contentHeight}px`
        }, 10)
      }
    }
  }, [openIndex])

  return (
    <div className="faq-list-compact">
      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <div
            key={index}
            className={`faq-accordion-item ${isOpen ? 'faq-accordion-item--open' : ''}`}
          >
            <button
              className="faq-accordion-button"
              onClick={() => toggleItem(index)}
              onKeyDown={e => handleKeyDown(e, index)}
              aria-expanded={isOpen}
              aria-controls={`faq-content-${index}`}
              type="button"
            >
              <span className="faq-accordion-button-text">{item.question}</span>
            </button>

            <div
              ref={el => (contentRefs.current[index] = el)}
              className="faq-accordion-content"
              id={`faq-content-${index}`}
              aria-hidden={!isOpen}
            >
              <div ref={el => (bodyRefs.current[index] = el)} className="faq-accordion-body">
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
