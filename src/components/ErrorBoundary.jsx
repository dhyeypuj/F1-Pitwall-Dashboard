import React from 'react'
import * as Sentry from '@sentry/react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to an error reporting service in production if available
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    Sentry.captureException(error, {
      extra: errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-card">
            <div className="checker-flag"></div>
            <h2>TECHNICAL FAULT</h2>
            <p>We've encountered a DRS failure in the dashboard rendering engine.</p>
            <button 
              className="retry-btn"
              onClick={() => window.location.reload()}
            >
              REBOOT SYSTEMS
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="error-stack">{this.state.error?.toString()}</pre>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
