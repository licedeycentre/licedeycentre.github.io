import React from 'react'
import { usePerformances } from '../hooks/useContent'
import { PerformanceCard } from '../components/PerformanceCard'
import PageLayout from '../components/PageLayout'
import { generatePerformanceId } from '../utils/slugify'

const PerformancesPage: React.FC = () => {
  const performances = usePerformances()

  return (
    <PageLayout
      title="Спектакли — Лицедей"
      description="Спектакли театра-студии 'Балаганчик' во Владивостоке. Детские и взрослые спектакли, театральные постановки, выступления."
      keywords="спектакли, театр, Владивосток, Балаганчик, постановки, выступления"
      breadcrumbs={[{ label: 'Главная', href: '/' }, { label: 'Спектакли' }]}
      centered={false}
    >
      <div className="performances-grid">
        {performances.map(performance => (
          <PerformanceCard
            key={generatePerformanceId(performance.title)}
            performance={performance}
            showDates={true}
            maxDates={3}
          />
        ))}
        {performances.length === 0 && <p>Спектаклей пока нет.</p>}
      </div>
    </PageLayout>
  )
}

export default PerformancesPage
