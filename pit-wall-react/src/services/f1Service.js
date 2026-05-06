import axios from 'axios'

const BASE_URL = 'https://api.jolpi.ca/ergast/f1'

// --- Simple Request Deduplication & Caching ---
const cache = new Map()

const fetchCached = async (url, ttl = 60000) => {
  const now = Date.now()
  if (cache.has(url)) {
    const { promise, timestamp } = cache.get(url)
    // Return existing promise if in-flight or if cache is still fresh
    if (now - timestamp < ttl) {
      return promise
    }
  }

  const reqPromise = axios.get(url).catch(err => {
    cache.delete(url) // Clear cache on failure so we can retry
    throw err
  })

  cache.set(url, { promise: reqPromise, timestamp: now })
  return reqPromise
}
// ----------------------------------------------

// Helper for UI colors
const getTeamColor = (id) => {
  const colors = {
    mercedes: 'var(--mercedes)',
    red_bull: 'var(--redbull)',
    ferrari: 'var(--ferrari)',
    mclaren: 'var(--mclaren)',
    aston_martin: 'var(--aston)',
    alpine: 'var(--alpine)',
    haas: 'var(--haas)',
    williams: 'var(--williams)',
    rb: 'var(--racingbulls)',
    sauber: 'var(--audi)',
  }
  return colors[id] || '#666'
}

export const getNextRace = async () => {
  try {
    // Batched with getCalendar: fetch entire schedule and extract next
    const { data } = await fetchCached(`${BASE_URL}/current.json`)
    const races = data.MRData.RaceTable.Races || []
    
    const now = new Date()
    const race = races.find(r => new Date(`${r.date}T${r.time || '00:00:00Z'}`) > now)
    
    if (!race) return null

    return {
      name: race.raceName, // for generic use
      round: `Round ${String(race.round).padStart(2, '0')}`,
      status: 'Up Next',
      flag: '🏁', 
      city: race.Circuit.Location.locality,
      country: race.Circuit.Location.country,
      title: race.raceName,
      circuit: race.Circuit.circuitName,
      location: race.Circuit.Location.country,
      date: `${race.date}T${race.time || '00:00:00Z'}`,
      details: `Round ${race.round} · ${race.Circuit.circuitName}`,
      stats: [] // API doesn't provide rich lap records directly
    }
  } catch (error) {
    console.error('Error fetching next race:', error)
    throw new Error('Failed to load race data')
  }
}

export const getStandings = async () => {
  try {
    const [driversRes, constructorsRes] = await Promise.all([
      fetchCached(`${BASE_URL}/current/driverStandings.json`),
      fetchCached(`${BASE_URL}/current/constructorStandings.json`)
    ])

    const rawDrivers = driversRes.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []
    const rawConstructors = constructorsRes.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || []

    const drivers = rawDrivers.map((d, i) => ({
      pos: String(d.position).padStart(2, '0'),
      name: `${d.Driver.givenName[0]}. ${d.Driver.familyName}`,
      code: d.Driver.code || d.Driver.familyName.substring(0, 3).toUpperCase(),
      team: d.Constructors[0]?.name || 'Unknown',
      nationality: d.Driver.nationality,
      points: Number(d.points),
      gap: i === 0 ? null : `−${rawDrivers[0].points - d.points}`,
      color: getTeamColor(d.Constructors[0]?.constructorId),
      codeBg: getTeamColor(d.Constructors[0]?.constructorId),
      codeColor: '#fff'
    }))

    const maxPts = rawConstructors.length > 0 ? Number(rawConstructors[0].points) : 100

    const constructors = rawConstructors.map(c => ({
      pos: String(c.position).padStart(2, '0'),
      name: c.Constructor.name,
      engine: c.Constructor.name + ' PU', // generic fallback
      nationality: c.Constructor.nationality,
      points: Number(c.points),
      width: maxPts > 0 ? `${Math.round((Number(c.points) / maxPts) * 100)}%` : '0%',
      color: getTeamColor(c.Constructor.constructorId)
    }))

    return { drivers, constructors }
  } catch (error) {
    console.error('Error fetching standings:', error)
    throw new Error('Failed to load standings')
  }
}

export const getCalendar = async () => {
  try {
    const { data } = await fetchCached(`${BASE_URL}/current.json`)
    const races = data.MRData.RaceTable.Races || []

    // Find the next race to flag it
    const now = new Date()
    let nextRaceId = null
    for (const r of races) {
      if (new Date(`${r.date}T${r.time || '00:00:00Z'}`) > now) {
        nextRaceId = r.round
        break
      }
    }

    return races.map(r => {
      const isPast = new Date(`${r.date}T${r.time || '00:00:00Z'}`) < now
      const isNext = r.round === nextRaceId

      return {
        id: r.round,
        round: r.round,
        num: `R${String(r.round).padStart(2, '0')}${isNext ? ' · NEXT' : ''}`,
        country: r.Circuit.Location.country,
        name: r.Circuit.circuitName,
        date: r.date,
        time: r.time,
        status: isPast ? 'DONE' : (isNext ? 'UP NEXT' : 'UPCOMING'),
        done: isPast,
        next: isNext,
        emoji: '🏁', 
        winner: '' // Would require separate results API call
      }
    })
  } catch (error) {
    console.error('Error fetching calendar:', error)
    throw new Error('Failed to load calendar')
  }
}
