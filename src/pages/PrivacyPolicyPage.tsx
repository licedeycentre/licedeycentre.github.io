import React from 'react'
import { usePrivacyPolicy } from '../hooks/useContent'
import PageLayout from '../components/PageLayout'
import { processHtmlContent } from '../utils/htmlProcessor'

const PrivacyPolicyPage: React.FC = () => {
  const policyData = usePrivacyPolicy()

  return (
    <PageLayout
      title={policyData.seo.title}
      description={policyData.seo.description}
      keywords={policyData.seo.keywords}
      breadcrumbs={[{ label: 'Главная', href: '/' }, { label: 'Политика конфиденциальности' }]}
      centered={false}
    >
      <div className="content-card">
        <div className="readable-content">{processHtmlContent(policyData.content)}</div>
      </div>
    </PageLayout>
  )
}

export default PrivacyPolicyPage
