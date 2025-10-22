import React from 'react'
import { ChevronDown } from 'lucide-react'

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

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  // Устанавливаем точную высоту для плавной анимации
  React.useEffect(() => {
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        if (openIndex === index) {
          ref.style.maxHeight = `${ref.scrollHeight}px`
        } else {
          ref.style.maxHeight = '0px'
        }
      }
    })
  }, [openIndex])

  // Разделяем элементы на две колонки
  const leftColumnItems = items.filter((_, index) => index % 2 === 0)
  const rightColumnItems = items.filter((_, index) => index % 2 === 1)

  const renderColumn = (columnItems: FAQItem[], startIndex: number) => (
    <div className="faq-column">
      {columnItems.map((item, columnIndex) => {
        const globalIndex = startIndex + columnIndex * 2
        const isOpen = openIndex === globalIndex

        return (
          <div key={globalIndex} className={`faq-item ${isOpen ? 'faq-item--open' : ''}`}>
            <button
              className="faq-question"
              onClick={() => toggleItem(globalIndex)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${globalIndex}`}
              type="button"
            >
              <span>{item.question}</span>
              <ChevronDown className="faq-icon" size={20} />
            </button>

            <div
              ref={el => (contentRefs.current[globalIndex] = el)}
              className="faq-answer"
              id={`faq-answer-${globalIndex}`}
              aria-hidden={!isOpen}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="faq-list">
      {renderColumn(leftColumnItems, 0)}
      {renderColumn(rightColumnItems, 1)}
    </div>
  )
}
