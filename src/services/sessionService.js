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

/**
 * Resolves the latest meeting and session from OpenF1 for the current year.
 * Handles 401 unauthorized errors gracefully (e.g., when a live race weekend blocks free access).
 */
let cachedSession = null
let lastFetchedTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export const getLatestOpenF1Session = async () => {
  const now = Date.now()
  if (cachedSession && (now - lastFetchedTime < CACHE_TTL)) {
    return cachedSession
  }

  const currentYear = new Date().getFullYear()
  try {
    const meetingsRes = await fetch(`https://api.openf1.org/v1/meetings?year=${currentYear}`)
    if (!meetingsRes.ok) {
      if (meetingsRes.status === 401) {
        return { error: 'unauthorized', detail: 'OpenF1 restricted access during live session.' }
      }
      throw new Error(`HTTP error! status: ${meetingsRes.status}`)
    }
    const meetings = await meetingsRes.json()
    if (!meetings || meetings.length === 0) return null

    const latestMeeting = meetings[meetings.length - 1]

    const sessionsRes = await fetch(`https://api.openf1.org/v1/sessions?meeting_key=${latestMeeting.meeting_key}`)
    if (!sessionsRes.ok) {
      if (sessionsRes.status === 401) {
        return { error: 'unauthorized', detail: 'OpenF1 restricted access during live session.' }
      }
      throw new Error(`HTTP error! status: ${sessionsRes.status}`)
    }
    const sessions = await sessionsRes.json()
    if (!sessions || sessions.length === 0) return null

    // Prefer active race session, or default to latest
    const raceSession = sessions.find(s => s.session_name === 'Race') || sessions[sessions.length - 1]
    
    cachedSession = raceSession
    lastFetchedTime = now
    
    return raceSession
  } catch (error) {
    console.error('Error resolving latest OpenF1 session:', error)
    if (error.status === 401 || (error.message && error.message.includes('401'))) {
      return { error: 'unauthorized', detail: 'OpenF1 restricted access during live session.' }
    }
    throw error
  }
}

/**
 * Fetches race control messages for a specific session from OpenF1.
 * Handles 401 unauthorized errors gracefully.
 */
export const getOpenF1RaceControl = async (sessionKey) => {
  if (!sessionKey) return []
  try {
    const response = await fetch(`https://api.openf1.org/v1/race_control?session_key=${sessionKey}`)
    if (!response.ok) {
      if (response.status === 401) {
        return { error: 'unauthorized', detail: 'OpenF1 restricted access during live session.' }
      }
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    
    // Normalize messages
    return data.map((msg, index) => ({
      id: msg.id || `openf1-rc-${index}-${Date.now()}`,
      timestamp: msg.date ? new Date(msg.date).toLocaleTimeString() : new Date().toLocaleTimeString(),
      lap_number: msg.lap_number || 0,
      category: msg.category || 'INFO',
      message: msg.message || '',
      flag: msg.flag || null,
      scope: msg.scope || null
    }))
  } catch (error) {
    console.error('Error fetching OpenF1 race control messages:', error)
    if (error.status === 401 || (error.message && error.message.includes('401'))) {
      return { error: 'unauthorized', detail: 'OpenF1 restricted access during live session.' }
    }
    throw error
  }
}


