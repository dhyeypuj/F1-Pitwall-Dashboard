/**
 * API Base URLs centralized for deployment readiness.
 * Uses Vite environment variables with safe defaults.
 */

export const ERGAST_API_BASE = import.meta.env.VITE_ERGAST_API_URL || 'https://api.jolpi.ca/ergast/f1'
export const OPENF1_API_BASE = import.meta.env.VITE_OPENF1_API_URL || 'https://api.openf1.org/v1'
export const APP_API_BASE = '/api'

export const NEWS_ENDPOINT = `${APP_API_BASE}/news`
export const HEALTH_ENDPOINT = `${APP_API_BASE}/health`

export default {
  ergast: ERGAST_API_BASE,
  openf1: OPENF1_API_BASE,
  news: NEWS_ENDPOINT
}
