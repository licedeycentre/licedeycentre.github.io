import React from 'react'
import { FileText, FileType, FileSpreadsheet, File } from 'lucide-react'

/**
 * Определяет иконку документа на основе расширения файла в URL
 * @param url - URL документа
 * @returns React компонент иконки
 */
export const getDocumentIcon = (url: string): React.ComponentType<{ size?: number }> => {
  // Извлекаем расширение файла из URL
  const extension = url.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'pdf':
      return FileText
    case 'doc':
    case 'docx':
      return FileType
    case 'xls':
    case 'xlsx':
      return FileSpreadsheet
    default:
      return File
  }
}

/**
 * Получает цвет для иконки документа на основе расширения файла
 * @param url - URL документа
 * @returns CSS цвет для иконки
 */
export const getDocumentColor = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'pdf':
      return '#b91c1c' // Темно-красный для PDF
    case 'doc':
    case 'docx':
      return '#1d4ed8' // Темно-синий для Word
    case 'xls':
    case 'xlsx':
      return '#15803d' // Темно-зеленый для Excel
    default:
      return '#374151' // Темно-серый для неизвестных форматов
  }
}

/**
 * Получает название типа документа для accessibility
 * @param url - URL документа
 * @returns Строка с описанием типа файла
 */
export const getDocumentType = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'pdf':
      return 'PDF документ'
    case 'doc':
    case 'docx':
      return 'Word документ'
    case 'xls':
    case 'xlsx':
      return 'Excel таблица'
    default:
      return 'Документ'
  }
}
