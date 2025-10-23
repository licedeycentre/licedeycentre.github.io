import React from 'react'
import type { Performance } from '../types/content'
import { Info, Clock, Calendar } from 'lucide-react'
import { getLastPastDateTimeString, parseDateTimeString, formatDateTimeStringShort } from '../utils/dateFormat'

interface PerformanceInfoCardProps {
  performance: Performance
}

export const PerformanceInfoCard: React.FC<PerformanceInfoCardProps> = ({ performance }) => {
  // Получаем последний показ спектакля (только прошедшие даты)
  const getLastShow = () => {
    return getLastPastDateTimeString(performance.showDates || [])
  }

  const lastShow = getLastShow()

  // Рендер мета-информации (возраст, продолжительность, последний показ)
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

    if (lastShow) {
      metaItems.push(
        <div key="lastShow" className="performance-meta-item">
          <div className="performance-meta-icon">
            <Calendar size={18} />
          </div>
          <div className="performance-meta-content">
            <div className="performance-meta-label">Последний показ</div>
            <div className="performance-meta-value">{formatDateTimeStringShort(lastShow)}</div>
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
