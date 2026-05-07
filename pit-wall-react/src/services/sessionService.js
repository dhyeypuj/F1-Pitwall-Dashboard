import axios from 'axios'
import { OPENF1_API_BASE } from '../config/api'

const OPENF1_BASE_URL = OPENF1_API_BASE

/**
 * Manual session overrides for the 2026 Concept season.
 * Used when OpenF1 doesn't have future data yet.
 */
const MANUAL_SESSIONS_2026 = {
  5: { // Round 5: Canada
    fp1: { start: '2026-05-22T16:30:00Z', end: '2026-05-22T17:30:00Z', name: 'Practice 1' },
    sprintQualifying: { start: '2026-05-22T20:30:00Z', end: '2026-05-22T21:14:00Z', name: 'Sprint Qualifying' },
    sprint: { start: '2026-05-23T16:00:00Z', end: '2026-05-23T17:00:00Z', name: 'Sprint' },
    qualifying: { start: '2026-05-23T20:00:00Z', end: '2026-05-23T21:00:00Z', name: 'Qualifying' },
    race: { start: '2026-05-24T20:00:00Z', end: '2026-05-24T22:00:00Z', name: 'Race' }
  }
}

/**
 * Mapping of OpenF1 session names to internal keys.
 */
const SESSION_NAME_MAP = {
  'Practice 1': 'fp1',
  'Practice 2': 'fp2',
  'Practice 3': 'fp3',
  'Qualifying': 'qualifying',
  'Sprint Qualifying': 'sprintQualifying',
  'Sprint': 'sprint',
  'Race': 'race'
}

/**
 * Fetch all sessions for a specific year and group them by race weekend.
 */
export const getSeasonSessions = async (year = 2024) => {
  try {
    // 1. Fetch all meetings for the year to get round numbers and meeting keys
    const { data: meetings } = await axios.get(`${OPENF1_BASE_URL}/meetings?year=${year}`)
    
    // 2. Fetch all sessions for the year
    const { data: sessions } = await axios.get(`${OPENF1_BASE_URL}/sessions?year=${year}`)

    // 3. Group sessions by meeting_key
    const sessionGroups = sessions.reduce((acc, session) => {
      const key = session.meeting_key
      if (!acc[key]) acc[key] = {}
      
      const internalKey = SESSION_NAME_MAP[session.session_name]
      if (internalKey) {
        acc[key][internalKey] = {
          start: session.date_start,
          end: session.date_end,
          name: session.session_name
        }
      }
      return acc
    }, {})

    // 4. Merge with meeting data to create a normalized round-based structure
    const normalized = meetings
      .filter(m => m.meeting_name.includes('Grand Prix'))
      .map((m, index) => {
        const round = index + 1
        const apiSessions = sessionGroups[m.meeting_key] || {}
        
        // Apply manual overrides for 2026 Concept if available
        const sessions = {
          ...apiSessions,
          ...(MANUAL_SESSIONS_2026[round] || {})
        }

        return {
          round,
          raceKey: m.meeting_key,
          country: m.country_name,
          location: m.location,
          circuit: m.circuit_short_name,
          sessions
        }
      })

    return normalized
  } catch (error) {
    console.error('Error fetching OpenF1 sessions:', error)
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
