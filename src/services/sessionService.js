import sessionsData from '../config/sessions_2026.json'

/**
 * Fetch all sessions for a specific year and group them by race weekend.
 * Returns the locally parsed and verified 2026 session schedule.
 */
export const getSeasonSessions = async (year = 2026) => {
  return sessionsData
}

/**
 * Helper to get the most immediate upcoming session for a race weekend.
 */
export const getNextSession = (sessions) => {
  if (!sessions) return null
  const now = new Date()
  
  const upcoming = Object.entries(sessions)
    .map(([key, data]) => ({ key, ...data }))
    .filter(s => new Date(s.start) > now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))

  return upcoming[0] || null
}

