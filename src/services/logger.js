import * as Sentry from '@sentry/react'

const isProd = import.meta.env.PROD

const formatMessage = (level, msg, args) => {
  const timestamp = new Date().toISOString()
  const argsStr = args.length 
    ? ` | ${args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ')}` 
    : ''
  return `[${timestamp}] [${level.toUpperCase()}] ${msg}${argsStr}`
}

export const logger = {
  debug: (msg, ...args) => {
    if (!isProd) {
      console.log(formatMessage('debug', msg, args))
    }
  },
  
  info: (msg, ...args) => {
    if (!isProd) {
      console.info(formatMessage('info', msg, args))
    } else {
      Sentry.addBreadcrumb({
        category: 'app',
        message: msg,
        level: 'info',
        data: args.length ? { args } : undefined
      })
    }
  },
  
  warn: (msg, ...args) => {
    if (!isProd) {
      console.warn(formatMessage('warn', msg, args))
    } else {
      Sentry.addBreadcrumb({
        category: 'app',
        message: msg,
        level: 'warning',
        data: args.length ? { args } : undefined
      })
    }
  },
  
  error: (msg, errorObj, ...args) => {
    if (!isProd) {
      console.error(formatMessage('error', msg, args))
      if (errorObj) {
        console.error(errorObj)
      }
    } else {
      const exception = errorObj instanceof Error ? errorObj : new Error(msg)
      
      Sentry.addBreadcrumb({
        category: 'error',
        message: msg,
        level: 'error',
        data: args.length ? { args } : undefined
      })
      
      Sentry.captureException(exception, {
        extra: {
          contextMessage: msg,
          additionalArgs: args
        }
      })
    }
  },

  testError: () => {
    if (!isProd) {
      const testErr = new Error('Test Sentry Error triggered via DevTools logger helper')
      logger.error('DevTools triggered test exception', testErr)
      return 'Test error captured via logger.error. Check console/Sentry.'
    }
    return 'DevTools testError is only available in development mode.'
  }
}

// Bind to window for easy DevTools access in development mode
if (typeof window !== 'undefined' && !isProd) {
  window.triggerTestSentryError = () => {
    return logger.testError()
  }
}
