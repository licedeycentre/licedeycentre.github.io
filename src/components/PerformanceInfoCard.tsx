import React from 'react'
import type { Performance } from '../types/content'
import { Info, Clock, Drama } from 'lucide-react'

interface PerformanceInfoCardProps {
  performance: Performance
}

export const PerformanceInfoCard: React.FC<PerformanceInfoCardProps> = ({ performance }) => {
  // Рендер мета-информации (возраст, продолжительность, жанр)
  const renderMetaInfo = () => {
    const metaItems = []

    if (performance.ageGroup) {
      metaItems.push(
        <div key="age" className="performance-meta-item">
          <div className="performance-meta-icon">
            <Info size={18} />
          </div>
          <div className="performance-meta-content">
            <div className="performance-meta-label">Возрастной ценз</div>
            <div className="performance-meta-value">{performance.ageGroup}</div>
          </div>
        </div>
      )
    }

    if (performance.duration) {
      metaItems.push(
        <div key="duration" className="performance-meta-item">
          <div className="performance-meta-icon">
            <Clock size={18} />
          </div>
          <div className="performance-meta-content">
            <div className="performance-meta-label">Продолжительность</div>
            <div className="performance-meta-value">{performance.duration}</div>
          </div>
        </div>
      )
    }

    if (performance.genre) {
      metaItems.push(
        <div key="genre" className="performance-meta-item">
          <div className="performance-meta-icon">
            <Drama size={18} />
          </div>
          <div className="performance-meta-content">
            <div className="performance-meta-label">Жанр</div>
            <div className="performance-meta-value">{performance.genre}</div>
          </div>
        </div>
      )
    }

    return metaItems.length > 0 ? <div className="performance-meta-table">{metaItems}</div> : null
  }

  // Рендер отдельной секции создателей
  const renderCreatorsSection = () => {
    if (!performance.creators) {
      return null
    }

    return (
      <div className="performance-creators-section">
        <p className="performance-creators-text">{performance.creators}</p>
      </div>
    )
  }

  return (
    <div className="content-card">
      {renderMetaInfo()}
      {renderCreatorsSection()}
    </div>
  )
}
