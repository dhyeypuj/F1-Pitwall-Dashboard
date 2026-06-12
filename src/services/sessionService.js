import sessions2026 from '../config/sessions_2026.json'
import { getSeasonSchedule, getActiveSeasonSync } from './seasonService'

/**
 * Fetch all sessions for a specific year and group them by race weekend.
 * Derives session timelines dynamically from Ergast schedule dates and times.
 * If API fetch fails for target year 2026, falls back to the locally parsed 2026 session schedule.
 */
export const getSeasonSessions = async (year) => {
  const targetYear = Number(year) || getActiveSeasonSync()
  
  try {
    const races = await getSeasonSchedule(targetYear)

    return races.map(r => {
      const sessions = {}
      
      const addSession = (key, name, rawDate, rawTime, durationHours) => {
        if (!rawDate) return
        const startStr = rawTime 
          ? (rawTime.endsWith('Z') ? `${rawDate}T${rawTime}` : `${rawDate}T${rawTime}Z`)
          : `${rawDate}T12:00:00Z`
        const start = new Date(startStr)
        if (isNaN(start.getTime())) return
        
        const end = new Date(start.getTime() + durationHours * 60 * 60 * 1000)
        sessions[key] = {
          name,
          start: start.toISOString(),
          end: end.toISOString()
        }
      }

      if (r.FirstPractice) {
        addSession('fp1', 'Practice 1', r.FirstPractice.date, r.FirstPractice.time, 1)
      }
      if (r.SecondPractice) {
        addSession('fp2', 'Practice 2', r.SecondPractice.date, r.SecondPractice.time, 1)
      }
      if (r.ThirdPractice) {
        addSession('fp3', 'Practice 3', r.ThirdPractice.date, r.ThirdPractice.time, 1)
      }
      if (r.Qualifying) {
        addSession('qualifying', 'Qualifying', r.Qualifying.date, r.Qualifying.time, 1)
      }
      if (r.Sprint) {
        addSession('sprint', 'Sprint Race', r.Sprint.date, r.Sprint.time, 1)
      }
      if (r.SprintQualifying) {
        addSession('sprintQualifying', 'Sprint Qualification', r.SprintQualifying.date, r.SprintQualifying.time, 1)
      }
      
      // Main Race
      addSession('race', 'Race', r.date, r.time, 2)

      return {
        round: Number(r.round),
        country: r.Circuit.Location.country,
        location: r.Circuit.Location.locality,
        circuit: r.Circuit.circuitName,
        sessions
      }
    })
  } catch (error) {
    console.error(`Failed to construct dynamic sessions for year ${targetYear}:`, error)
    if (targetYear === 2026) {
      return sessions2026
    }
    return []
  }
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

/**
 * Determines whether a session type is eligible for the extended-time grace window.
 * Only the main Race session can run past its scheduled end time due to
 * red flags, safety cars, or other delays. Practice and qualifying sessions
 * have fixed durations and should transition immediately when their end time passes.
 *
 * @param {string} sessionKey - The session key (e.g., 'race', 'fp1', 'qualifying')
 * @param {string} [sessionName] - The display name of the session (e.g., 'Race', 'Practice 1')
 * @returns {boolean} True if the session is eligible for an extended grace window.
 */
export const isExtendableSession = (sessionKey, sessionName) => {
  const key = (sessionKey || '').toLowerCase()
  const name = (sessionName || '').toLowerCase()
  return key === 'race' || name === 'race'
}
