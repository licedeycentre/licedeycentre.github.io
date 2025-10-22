import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '80px auto',
          }}
        >
          <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#d32f2f' }}>
            Что-то пошло не так
          </h1>
          <p style={{ marginBottom: '24px', color: '#666' }}>
            Произошла непредвиденная ошибка. Пожалуйста, попробуйте обновить страницу.
          </p>
          {this.state.error && (
            <details
              style={{
                textAlign: 'left',
                padding: '16px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                marginTop: '16px',
              }}
            >
              <summary style={{ cursor: 'pointer', marginBottom: '8px' }}>
                Техническая информация
              </summary>
              <pre
                style={{
                  fontSize: '12px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {this.state.error.toString()}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '24px',
              padding: '12px 24px',
              fontSize: '16px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Обновить страницу
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
