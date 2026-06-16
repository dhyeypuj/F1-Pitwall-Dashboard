import axios from 'axios'

let cachedActiveSeason = null
const scheduleCache = new Map()

/**
 * Synchronous season detection using calendar approximation.
 * If current date is before March 1st, defaults to previous year.
 */
export const getActiveSeasonSync = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const marchFirst = new Date(currentYear, 2, 1) // March 1st
  return now < marchFirst ? currentYear - 1 : currentYear
}

/**
 * Intelligent season detection.
 * Resolves the active season by checking the first race of the current calendar year.
 * If today's date is before the start of the first weekend's FP1, returns previous season.
 */
export const getActiveSeason = async () => {
  if (cachedActiveSeason) return cachedActiveSeason

  const now = new Date()
  const currentYear = now.getFullYear()

  try {
    const res = await axios.get(`https://api.jolpi.ca/ergast/f1/${currentYear}.json`)
    const races = res.data?.MRData?.RaceTable?.Races || []
    
    if (races.length > 0) {
      const firstRace = races[0]
      let firstSessionStart = null
      
      if (firstRace.FirstPractice?.date) {
        const fp1Str = firstRace.FirstPractice.time 
          ? `${firstRace.FirstPractice.date}T${firstRace.FirstPractice.time}` 
          : `${firstRace.FirstPractice.date}T10:00:00Z`
        firstSessionStart = new Date(fp1Str)
      } else {
        const raceStr = firstRace.time 
          ? `${firstRace.date}T${firstRace.time}` 
          : `${firstRace.date}T14:00:00Z`
        firstSessionStart = new Date(raceStr)
      }

      if (now < firstSessionStart) {
        cachedActiveSeason = currentYear - 1
      } else {
        cachedActiveSeason = currentYear
      }
    } else {
      cachedActiveSeason = currentYear
    }
  } catch (error) {
    console.warn("Failed to detect active season via API. Falling back to calendar estimate:", error.message)
    cachedActiveSeason = getActiveSeasonSync()
  }

  return cachedActiveSeason
}

/**
 * Fetch and cache the schedule for a given season.
 */
export const getSeasonSchedule = async (season) => {
  if (scheduleCache.has(season)) {
    return scheduleCache.get(season)
  }
  
  const url = `https://api.jolpi.ca/ergast/f1/${season}.json`
  const res = await axios.get(url)
  const races = res.data?.MRData?.RaceTable?.Races || []
  
  scheduleCache.set(season, races)
  return races
}

/**
 * Determine the status of a race weekend.
 * Status can be 'completed', 'live', or 'upcoming'.
 */
export const getRaceStatus = (race, now = new Date()) => {
  const raceDateStr = race.time 
    ? (race.time.endsWith('Z') ? `${race.date}T${race.time}` : `${race.date}T${race.time}Z`)
    : `${race.date}T14:00:00Z`
  const raceTime = new Date(raceDateStr)
  
  let fp1Time = null
  if (race.FirstPractice?.date) {
    const fp1TimeStr = race.FirstPractice.time 
      ? (race.FirstPractice.time.endsWith('Z') ? `${race.FirstPractice.date}T${race.FirstPractice.time}` : `${race.FirstPractice.date}T${race.FirstPractice.time}Z`)
      : `${race.FirstPractice.date}T10:00:00Z`
    fp1Time = new Date(fp1TimeStr)
  } else {
    // Default FP1 to 54 hours before race
    fp1Time = new Date(raceTime.getTime() - 54 * 60 * 60 * 1000)
  }

  const raceEndTime = new Date(raceTime.getTime() + 3 * 60 * 60 * 1000)

  if (now > raceEndTime) {
    return 'completed'
  } else if (now >= fp1Time && now <= raceEndTime) {
    return 'live'
  } else {
    return 'upcoming'
  }
}

/**
 * Determine session-level states of a race weekend.
 * Outputs: NOT_STARTED, PRACTICE, QUALIFYING, SPRINT, RACE, FINISHED.
 */
export const getSessionState = (sessions, now = new Date()) => {
  if (!sessions || Object.keys(sessions).length === 0) return 'NOT_STARTED'

  const sessionList = Object.entries(sessions)
    .map(([key, data]) => {
      let type = 'PRACTICE'
      const k = key.toLowerCase()
      if (k.includes('qualifying') || k.includes('shootout') || k.includes('sprintqualifying')) {
        type = 'QUALIFYING'
      } else if (k === 'sprint') {
        type = 'SPRINT'
      } else if (k === 'race') {
        type = 'RACE'
      }
      return {
        key,
        name: data.name,
        start: new Date(data.start),
        end: new Date(data.end),
        type
      }
    })
    .sort((a, b) => a.start - b.start)

  if (sessionList.length === 0) return 'NOT_STARTED'

  const firstSession = sessionList[0]
  const lastSession = sessionList[sessionList.length - 1]

  if (now < firstSession.start) {
    return 'NOT_STARTED'
  }
  if (now > lastSession.end) {
    return 'FINISHED'
  }

  // Inside session check
  for (const s of sessionList) {
    if (now >= s.start && now <= s.end) {
      return s.type
    }
  }

  // Gap between sessions -> next session type
  const nextSession = sessionList.find(s => now < s.start)
  return nextSession ? nextSession.type : 'FINISHED'
}

/**
 * Computes the weekend completion percentage (0.0 to 100.0).
 */
export const getWeekendCompletionPercent = (sessions, now = new Date()) => {
  if (!sessions || Object.keys(sessions).length === 0) return 0

  const sessionList = Object.entries(sessions)
    .map(([_, data]) => ({
      start: new Date(data.start),
      end: new Date(data.end)
    }))
    .sort((a, b) => a.start - b.start)

  if (sessionList.length === 0) return 0

  const total = sessionList.length
  let completed = 0

  for (const s of sessionList) {
    if (now > s.end) {
      completed += 1
    } else if (now >= s.start && now <= s.end) {
      const denom = s.end - s.start
      const elapsed = now - s.start
      if (denom > 0) {
        completed += Math.min(Math.max(elapsed / denom, 0), 1)
      }
    }
  }

  return Math.min(Math.max((completed / total) * 100, 0), 100)
}

/**
 * Computes season completion percentage (0.0 to 100.0).
 */
export const getSeasonCompletionPercent = (races, now = new Date()) => {
  if (!races || races.length === 0) return 0
  const completed = races.filter(r => getRaceStatus(r, now) === 'completed').length
  return Math.min(Math.max((completed / races.length) * 100, 0), 100)
}

/**
 * Get current round based on the race schedule.
 */
export const getCurrentRound = (races, now = new Date()) => {
  if (!races || races.length === 0) return 1
  
  // Find the first upcoming or live round
  const activeOrUpcoming = races.find(r => getRaceStatus(r, now) !== 'completed')
  if (activeOrUpcoming) {
    return Number(activeOrUpcoming.round)
  }
  
  // If all completed, return final round
  return races.length
}

/**
 * Find next race object from races schedule.
 */
export const getNextRace = (races, now = new Date()) => {
  if (!races || races.length === 0) return null
  const activeOrUpcoming = races.find(r => getRaceStatus(r, now) !== 'completed')
  return activeOrUpcoming || races[races.length - 1]
}

/**
 * Format race weekend date ranges in a timezone-safe manner.
 */
export const formatRaceWeekendDatesFromStrings = (raceDateStr, firstPracticeDateStr) => {
  if (!raceDateStr) return ''
  const stdMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const raceParts = raceDateStr.split('-').map(Number)
  if (raceParts.length !== 3) return ''
  
  let startParts
  if (firstPracticeDateStr) {
    startParts = firstPracticeDateStr.split('-').map(Number)
  }
  
  if (!startParts || startParts.length !== 3) {
    const raceDate = new Date(Date.UTC(raceParts[0], raceParts[1] - 1, raceParts[2]))
    const startDate = new Date(raceDate.getTime() - 2 * 24 * 60 * 60 * 1000)
    startParts = [startDate.getUTCFullYear(), startDate.getUTCMonth() + 1, startDate.getUTCDate()]
  }
  
  const startMonthStr = stdMonths[startParts[1] - 1]
  const endMonthStr = stdMonths[raceParts[1] - 1]
  const startDay = startParts[2]
  const endDay = raceParts[2]
  
  if (startMonthStr === endMonthStr) {
    return `${startMonthStr} ${startDay} – ${endDay}`
  } else {
    return `${startMonthStr} ${startDay} – ${endMonthStr} ${endDay}`
  }
}

