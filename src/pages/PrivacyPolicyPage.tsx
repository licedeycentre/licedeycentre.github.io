import React from 'react'
import { usePrivacyPolicy } from '../hooks/useContent'
import PageLayout from '../components/PageLayout'

const PrivacyPolicyPage: React.FC = () => {
  const policyData = usePrivacyPolicy()

  const renderContent = (content: (string | { type: 'list'; items: string[] })[]) => {
    return content.map((item, index) => {
      if (typeof item === 'string') {
        // Заменяем {currentDate} на текущую дату
        const processedText = item.replace('{currentDate}', new Date().toLocaleDateString('ru-RU'))
        return <p key={index}>{processedText}</p>
      } else if (item.type === 'list') {
        return (
          <ul key={index}>
            {item.items.map((listItem, listIndex) => (
              <li key={listIndex}>{listItem}</li>
            ))}
          </ul>
        )
      }
      return null
    })
  }

  return (
    <PageLayout
      title={policyData.seo.title}
      description={policyData.seo.description}
      keywords={policyData.seo.keywords}
      breadcrumbs={[{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }]}
      centered={false}
    >
      <div className="content-card">
        {policyData.sections.map((section, index) => (
          <div key={index} className="readable-content">
            <h2>{section.title}</h2>
            {renderContent(section.content)}
          </div>
        ))}
      </div>
    </PageLayout>
  )
}

export default PrivacyPolicyPage
