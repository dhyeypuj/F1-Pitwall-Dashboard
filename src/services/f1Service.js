import axios from 'axios'
import { ERGAST_API_BASE } from '../config/api'
import { getRaceMetadata } from '../config/raceMetadata'
import { 
  getActiveSeason, 
  getActiveSeasonSync,
  getSeasonSchedule, 
  getRaceStatus, 
  getCurrentRound, 
  getSeasonCompletionPercent, 
  formatRaceWeekendDatesFromStrings 
} from './seasonService'

const BASE_URL = ERGAST_API_BASE

export const formatDriverNameAbbreviated = (givenName, familyName) => {
  const initial = givenName ? givenName[0] : ''
  return initial ? `${initial}. ${familyName}` : familyName
}

const cache = new Map()
const fetchCached = async (url, ttl = 60000) => {
  const now = Date.now()
  if (cache.has(url)) {
    const { promise, timestamp } = cache.get(url)
    if (now - timestamp < ttl) return promise
  }
  const reqPromise = axios.get(url).catch(err => { cache.delete(url); throw err; })
  cache.set(url, { promise: reqPromise, timestamp: now })
  return reqPromise
}

const getFlagUrl = (nationality) => {
  const mapping = { 'British': 'gb', 'Dutch': 'nl', 'Monegasque': 'mc', 'Italian': 'it', 'Spanish': 'es', 'German': 'de', 'Australian': 'au', 'Mexican': 'mx', 'Canadian': 'ca', 'Japanese': 'jp', 'French': 'fr', 'Chinese': 'cn', 'Finnish': 'fi', 'Danish': 'dk', 'Thai': 'th', 'American': 'us', 'Brazilian': 'br', 'New Zealander': 'nz', 'Argentine': 'ar', 'Austrian': 'at' }
  return `https://flagcdn.com/w40/${(mapping[nationality] || 'un').toLowerCase()}.png`
}

const getTeamDisplayName = (id, apiName, season = getActiveSeasonSync()) => {
  const year = Number(season) || 2026
  const names = { 
    ferrari: 'Scuderia Ferrari HP', 
    mercedes: 'Mercedes-AMG PETRONAS Formula One Team', 
    red_bull: 'Oracle Red Bull Racing', 
    redbull: 'Oracle Red Bull Racing', 
    mclaren: 'McLaren Formula 1 Team', 
    aston_martin: 'Aston Martin Aramco Formula One Team', 
    astonmartin: 'Aston Martin Aramco Formula One Team', 
    williams: 'Atlassian Williams Racing', 
    alpine: 'BWT Alpine Formula One Team', 
    haas: 'MoneyGram Haas F1 Team', 
    rb: 'Visa Cash App Racing Bulls F1 Team', 
    racingbulls: 'Visa Cash App Racing Bulls F1 Team', 
    vcarb: 'Visa Cash App Racing Bulls F1 Team', 
    sauber: 'Stake F1 Team Kick Sauber', 
    kick_sauber: 'Stake F1 Team Kick Sauber',
    alphatauri: 'Scuderia AlphaTauri',
    torro_rosso: 'Scuderia Toro Rosso',
    force_india: 'Sahara Force India F1 Team',
    racing_point: 'SportPesa Racing Point F1 Team',
    renault: 'Renault DP World F1 Team',
    audi: 'Audi F1 Team', 
    andretti: 'Cadillac Formula 1 Team', 
    cadillac: 'Cadillac Formula 1 Team' 
  }
  
  if (year < 2026) {
    names.ferrari = 'Scuderia Ferrari'
    names.williams = 'Williams Racing'
    names.sauber = 'Stake F1 Team Kick Sauber'
  }
  if (year < 2024) {
    names.sauber = 'Alfa Romeo F1 Team Stake'
    names.rb = 'Scuderia AlphaTauri'
    names.racingbulls = 'Scuderia AlphaTauri'
    names.vcarb = 'Scuderia AlphaTauri'
  }
  
  const sid = String(id).toLowerCase().replace(/\s+/g, '_')
  return names[sid] || apiName || id
}

const getTeamPU = (id, season = getActiveSeasonSync()) => {
  const year = Number(season) || 2026
  const pus = { 
    ferrari: 'Ferrari S.p.A.', 
    haas: 'Ferrari S.p.A.', 
    cadillac: 'Ferrari S.p.A.', 
    andretti: 'Ferrari S.p.A.', 
    mercedes: 'Mercedes-AMG High Performance Powertrains', 
    mclaren: 'Mercedes-AMG High Performance Powertrains', 
    williams: 'Mercedes-AMG High Performance Powertrains', 
    alpine: 'Mercedes-AMG High Performance Powertrains', 
    red_bull: 'Red Bull Ford Powertrains', 
    redbull: 'Red Bull Ford Powertrains', 
    rb: 'Red Bull Ford Powertrains', 
    vcarb: 'Red Bull Ford Powertrains', 
    racingbulls: 'Red Bull Ford Powertrains', 
    aston_martin: 'Honda Racing Corporation', 
    astonmartin: 'Honda Racing Corporation', 
    audi: 'Audi Formula Racing GmbH', 
    sauber: 'Audi Formula Racing GmbH' 
  }
  
  if (year < 2026) {
    pus.red_bull = 'Honda RBPT'
    pus.redbull = 'Honda RBPT'
    pus.rb = 'Honda RBPT'
    pus.vcarb = 'Honda RBPT'
    pus.racingbulls = 'Honda RBPT'
    pus.sauber = 'Ferrari S.p.A.'
    pus.aston_martin = 'Mercedes-AMG High Performance Powertrains'
    pus.astonmartin = 'Mercedes-AMG High Performance Powertrains'
  }
  
  const sid = String(id).toLowerCase().replace(/\s+/g, '_')
  return pus[sid] || 'Internal Power Unit'
}

export const getTeamLogo = (id, season = getActiveSeasonSync()) => {
  const year = Number(season) || 2026
  let teamPath = id.toLowerCase()
  if (teamPath === 'red_bull') teamPath = 'redbull'
  if (teamPath === 'aston_martin') teamPath = 'astonmartin'
  
  if (year < 2026) {
    if (teamPath === 'audi') teamPath = 'sauber'
    if (teamPath === 'cadillac' || teamPath === 'andretti') teamPath = 'sauber'
  } else {
    if (teamPath === 'sauber') teamPath = 'audi'
    if (teamPath === 'andretti') teamPath = 'cadillac'
  }

  const cdnPaths = {
    ferrari: 'ferrari',
    mercedes: 'mercedes',
    redbull: 'redbullracing',
    red_bull: 'redbullracing',
    mclaren: 'mclaren',
    astonmartin: 'astonmartin',
    aston_martin: 'astonmartin',
    williams: 'williams',
    alpine: 'alpine',
    haas: 'haasf1team',
    rb: 'racingbulls',
    racingbulls: 'racingbulls',
    sauber: 'sauber',
    audi: 'audi',
    cadillac: 'cadillac',
    andretti: 'cadillac'
  }

  const folder = cdnPaths[teamPath] || teamPath
  
  let filename = `${folder}logo.svg`
  if (folder === 'redbullracing') {
    filename = 'redbullracinglogo.svg'
  } else if (folder === 'haasf1team') {
    filename = 'haasf1teamlogo.svg'
  }
  
  return `https://media.formula1.com/image/upload/v1740000001/common/f1/${year}/${folder}/${year}${filename}`
}

const getTeamColor = (id) => {
  const colors = {
    mercedes: 'var(--mercedes)',
    red_bull: 'var(--redbull)',
    redbull: 'var(--redbull)',
    ferrari: 'var(--ferrari)',
    mclaren: 'var(--mclaren)',
    aston_martin: 'var(--astonmartin)',
    astonmartin: 'var(--astonmartin)',
    alpine: 'var(--alpine)',
    haas: 'var(--haas)',
    williams: 'var(--williams)',
    rb: 'var(--racingbulls)',
    racingbulls: 'var(--racingbulls)',
    sauber: 'var(--audi)',
    audi: 'var(--audi)',
    andretti: 'var(--cadillac)',
    cadillac: 'var(--cadillac)'
  }
  return colors[id] || '#666'
}

export const getCdnConstructorPath = (constructorId) => {
  const mapping = {
    ferrari: 'ferrari',
    mercedes: 'mercedes',
    red_bull: 'redbullracing',
    redbull: 'redbullracing',
    mclaren: 'mclaren',
    aston_martin: 'astonmartin',
    astonmartin: 'astonmartin',
    williams: 'williams',
    alpine: 'alpine',
    haas: 'haasf1team',
    rb: 'racingbulls',
    racingbulls: 'racingbulls',
    sauber: 'audi',
    audi: 'audi',
    andretti: 'cadillac',
    cadillac: 'cadillac'
  }
  return mapping[constructorId.toLowerCase()] || constructorId.toLowerCase()
}

export const getDriverImage = (driverName, constructorId, season = getActiveSeasonSync()) => {
  const year = Number(season) || 2026
  const team = getCdnConstructorPath(constructorId)
  const normName = driverName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  
  const driverCodes = {
    "charles leclerc": "chalec01",
    "lewis hamilton": "lewham01",
    "max verstappen": "maxver01",
    "lando norris": "lannor01",
    "oscar piastri": "oscpia01",
    "george russell": "georus01",
    "andrea kimi antonelli": "andant01",
    "kimi antonelli": "andant01",
    "carlos sainz": "carsai01",
    "alexander albon": "alealb01",
    "alex albon": "alealb01",
    "pierre gasly": "piegas01",
    "franco colapinto": "fracol01",
    "esteban ocon": "estoco01",
    "oliver bearman": "olibea01",
    "liam lawson": "lialaw01",
    "arvid lindblad": "arvlin01",
    "nico hulkenberg": "nichul01",
    "nico hülkenberg": "nichul01",
    "gabriel bortoleto": "gabbor01",
    "sergio perez": "serper01",
    "sergio pérez": "serper01",
    "valtteri bottas": "valbot01"
  }
  
  const code = driverCodes[normName] || (normName.split(' ')[0].substring(0,3) + normName.split(' ').pop().substring(0,3) + '01')
  
  return `https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:${year}:fallback:driver:${year}fallbackdriverfront.webp/v1740000001/common/f1/${year}/${team}/${code}/${year}${team}${code}front.webp`
}


export const getNextRace = async () => {
  try {
    const season = await getActiveSeason()
    const races = await getSeasonSchedule(season)
    if (races.length === 0) return null

    const now = new Date()
    const nextRaceObj = races.find(r => getRaceStatus(r, now) !== 'completed') || races[races.length - 1]
    
    const meta = getRaceMetadata(
      nextRaceObj.Circuit.circuitId,
      nextRaceObj.Circuit.Location.country,
      nextRaceObj.Circuit.Location.locality,
      nextRaceObj.raceName
    )

    const formattedDates = formatRaceWeekendDatesFromStrings(nextRaceObj.date, nextRaceObj.FirstPractice?.date)
    
    const isoDate = nextRaceObj.time 
      ? (nextRaceObj.time.endsWith('Z') ? `${nextRaceObj.date}T${nextRaceObj.time}` : `${nextRaceObj.date}T${nextRaceObj.time}Z`)
      : `${nextRaceObj.date}T14:00:00Z`

    const statusVal = getRaceStatus(nextRaceObj, now)

    return {
      name: nextRaceObj.raceName,
      round: `Round ${String(nextRaceObj.round).padStart(2, '0')}`,
      status: statusVal === 'live' ? 'Live' : 'Up Next',
      flag: '🏁',
      city: nextRaceObj.Circuit.Location.locality,
      country: nextRaceObj.Circuit.Location.country,
      title: nextRaceObj.raceName,
      countryCode: meta.countryCode,
      circuit: nextRaceObj.Circuit.circuitName,
      location: `${nextRaceObj.Circuit.Location.locality}, ${nextRaceObj.Circuit.Location.country}`,
      venue: nextRaceObj.Circuit.circuitName,
      roundNumber: Number(nextRaceObj.round),
      date: isoDate, 
      details: `Round ${nextRaceObj.round} · ${nextRaceObj.Circuit.circuitName}`,
      laps: meta.laps,
      distance: meta.distanceKm,
      lapRecord: meta.lapRecord !== "—" ? `${meta.lapRecord} · ${meta.lapRecordHolder}` : "—",
      previousPole: meta.previousPole,
      dates: formattedDates,
      stats: [
        { label: "Laps", value: meta.laps },
        { label: "Distance", value: `${meta.distanceKm} km` },
        { label: "Record", value: meta.lapRecord !== "—" ? `${meta.lapRecord} · ${meta.lapRecordHolder}` : "—" },
        { label: "Prev. Pole", value: meta.previousPole }
      ]
    }
  } catch (error) {
    console.error('Error fetching next race:', error)
    return null
  }
}

export const getStandings = async () => {
  try {
    const season = await getActiveSeason()
    const [driversRes, constructorsRes] = await Promise.all([
      fetchCached(`${BASE_URL}/${season}/driverStandings.json`), 
      fetchCached(`${BASE_URL}/${season}/constructorStandings.json`)
    ])
    const rawDrivers = driversRes.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []
    const rawConstructors = constructorsRes.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || []
    
    const drivers = rawDrivers.map((d, i) => ({ 
      pos: String(d.position).padStart(2, '0'), 
      name: formatDriverNameAbbreviated(d.Driver.givenName, d.Driver.familyName), 
      code: d.Driver.code || d.Driver.familyName.substring(0, 3).toUpperCase(), 
      team: getTeamDisplayName(d.Constructors[0]?.constructorId, d.Constructors[0]?.name, season) || 'Unknown', 
      constructorId: d.Constructors[0]?.constructorId,
      nationality: d.Driver.nationality, 
      flagUrl: getFlagUrl(d.Driver.nationality), 
      logoUrl: getTeamLogo(d.Constructors[0]?.constructorId, season), 
      points: Number(d.points), 
      gap: i === 0 ? null : `−${rawDrivers[0].points - d.points}`, 
      width: rawDrivers.length > 0 ? `${Math.round((Number(d.points) / Number(rawDrivers[0].points)) * 100)}%` : '0%',
      color: getTeamColor(d.Constructors[0]?.constructorId), 
      codeBg: getTeamColor(d.Constructors[0]?.constructorId), 
      codeColor: '#fff' 
    }))

    const maxPts = rawConstructors.length > 0 ? Number(rawConstructors[0].points) : 100
    const constructors = rawConstructors.map(c => ({ 
      pos: String(c.position).padStart(2, '0'), 
      name: getTeamDisplayName(c.Constructor.constructorId, c.Constructor.name, season), 
      engine: getTeamPU(c.Constructor.constructorId, season), 
      nationality: c.Constructor.nationality, 
      flagUrl: getFlagUrl(c.Constructor.nationality), 
      logoUrl: getTeamLogo(c.Constructor.constructorId, season), 
      points: Number(c.points), 
      width: maxPts > 0 ? `${Math.round((Number(c.points) / maxPts) * 100)}%` : '0%', 
      color: getTeamColor(c.Constructor.constructorId) 
    }))
    
    return { drivers, constructors }
  } catch (error) { 
    console.error('Error fetching standings:', error); 
    throw new Error('Failed to load standings'); 
  }
}

const openF1WinnerCache = new Map()

export const getOpenF1WinnerForRound = async (roundNumber, location) => {
  const cacheKey = `${roundNumber}_${location}`
  if (openF1WinnerCache.has(cacheKey)) {
    return openF1WinnerCache.get(cacheKey)
  }
  try {
    const season = await getActiveSeason()
    // 1. Get meeting key for active season at this location
    const meetingsRes = await axios.get(`https://api.openf1.org/v1/meetings?year=${season}&location=${encodeURIComponent(location)}`)
    const meeting = meetingsRes.data?.[0]
    if (!meeting) return null
    
    // 2. Get race session key
    const sessionsRes = await axios.get(`https://api.openf1.org/v1/sessions?meeting_key=${meeting.meeting_key}&session_name=Race`)
    const session = sessionsRes.data?.[0]
    if (!session) return null
    
    // 3. Get positions filtered by position=1
    const posRes = await axios.get(`https://api.openf1.org/v1/position?session_key=${session.session_key}&position=1`)
    const p1Records = posRes.data
    if (!p1Records || p1Records.length === 0) return null
    
    // Sort by date to get the final record (finishing P1)
    p1Records.sort((a, b) => new Date(a.date) - new Date(b.date))
    const finalP1 = p1Records[p1Records.length - 1]
    const winnerNum = finalP1.driver_number
    
    // 4. Get driver details
    const driverRes = await axios.get(`https://api.openf1.org/v1/drivers?session_key=${session.session_key}&driver_number=${winnerNum}`)
    const driver = driverRes.data?.[0]
    if (!driver) return null
    
    const winnerName = formatDriverNameAbbreviated(driver.first_name, driver.last_name)
    
    openF1WinnerCache.set(cacheKey, winnerName)
    return winnerName
  } catch (err) {
    console.error(`Error fetching OpenF1 winner for round ${roundNumber}:`, err)
    return null
  }
}

export const getCalendar = async () => {
  try {
    const season = await getActiveSeason()
    // Parallel fetch for calendar rounds and actual race results
    const [calendarRes, resultsRes] = await Promise.all([
      fetchCached(`${BASE_URL}/${season}.json`),
      fetchCached(`${BASE_URL}/${season}/results.json?limit=100`).catch(() => ({ data: { MRData: { RaceTable: { Races: [] } } } }))
    ]).catch(() => [{ data: { MRData: { RaceTable: { Races: [] } } } }, { data: { MRData: { RaceTable: { Races: [] } } } }])

    const races = calendarRes.data?.MRData?.RaceTable?.Races || []
    const apiResults = resultsRes.data?.MRData?.RaceTable?.Races || []
    
    // Create a map for quick lookup: round -> winner name
    const resultsMap = new Map(apiResults.map(r => [
      Number(r.round), 
      formatDriverNameAbbreviated(r.Results[0].Driver.givenName, r.Results[0].Driver.familyName)
    ]))

    const now = new Date()
    const currentRound = getCurrentRound(races, now)

    const processedRounds = await Promise.all(races.map(async r => {
      const meta = getRaceMetadata(
        r.Circuit.circuitId,
        r.Circuit.Location.country,
        r.Circuit.Location.locality,
        r.raceName
      )

      const formattedDates = formatRaceWeekendDatesFromStrings(r.date, r.FirstPractice?.date)
      const raceStatusVal = getRaceStatus(r, now)
      
      const isPast = raceStatusVal === 'completed'
      const isLive = raceStatusVal === 'live'
      const isNext = Number(r.round) === currentRound

      let winnerName = resultsMap.get(Number(r.round))

      // Fallback to OpenF1 if race is past and winner is missing from results endpoint
      if (!winnerName && isPast) {
        winnerName = await getOpenF1WinnerForRound(Number(r.round), r.Circuit.Location.locality)
      }

      // Final fallback to TBD
      winnerName = winnerName || (isPast ? 'TBD' : '')

      return {
        id: Number(r.round),
        round: Number(r.round),
        num: `R${String(r.round).padStart(2, '0')}${isNext ? ' · NEXT' : ''}`,
        country: r.Circuit.Location.country,
        name: r.raceName,
        circuit: r.Circuit.circuitName,
        date: formattedDates,
        status: isLive ? 'LIVE' : (isPast ? 'DONE' : (isNext ? 'UP NEXT' : 'UPCOMING')),
        done: isPast,
        next: isNext || isLive,
        emoji: '🏁',
        flagUrl: `https://flagcdn.com/w80/${meta.countryCode.toLowerCase()}.png`,
        winner: winnerName
      }
    }))

    const pct = getSeasonCompletionPercent(races, now)

    return {
      meta: `${races.length} Rounds · ${season}`,
      progress: `${pct.toFixed(1)}%`,
      rounds: processedRounds
    }
  } catch (error) {
    console.error('Error fetching calendar:', error)
    const activeYear = getActiveSeasonSync()
    return { meta: `22 Rounds · ${activeYear}`, progress: '0%', rounds: [] }
  }
}

export const getLatestResults = async () => {
  try {
    const season = await getActiveSeason()
    const { data } = await fetchCached(`${BASE_URL}/${season}/last/results.json`)
    const race = data.MRData.RaceTable.Races[0]
    if (!race || !race.Results) return { title: '', results: [], winner: null }
    const top3 = race.Results.slice(0, 3).map((r, i) => { 
      const cid = r.Constructor.constructorId; 
      return { 
        id: `p${i + 1}`, 
        cls: `p${i + 1}`, 
        badge: `P${i + 1}`, 
        name: `${r.Driver.givenName} ${r.Driver.familyName}`, 
        team: `${getTeamDisplayName(cid, r.Constructor.name, season)} · #${r.number}`, 
        nationality: r.Driver.nationality, 
        flagUrl: getFlagUrl(r.Driver.nationality), 
        logoUrl: getTeamLogo(cid, season), 
        color: getTeamColor(cid), 
        time: i === 0 ? r.Time?.time || 'Winner' : r.Time?.time || `+${r.Time?.millis}ms` 
      } 
    })
    return { 
      title: `${race.raceName} · ${race.Circuit.Location.locality} · Result`, 
      results: top3, 
      winner: { 
        ...race.Results[0], 
        Constructor: { 
          ...race.Results[0].Constructor, 
          name: getTeamDisplayName(race.Results[0].Constructor.constructorId, race.Results[0].Constructor.name, season) 
        } 
      } 
    }
  } catch (error) { 
    console.error('Error fetching latest results:', error); 
    return { title: '', results: [], winner: null }; 
  }
}

export const getRaceStats = async () => {
  try {
    const season = await getActiveSeason()
    const { data } = await fetchCached(`${BASE_URL}/${season}/last/results.json`)
    const race = data.MRData.RaceTable.Races[0]
    if (!race || !race.Results) return null
    const fl = race.Results.find(r => r.FastestLap?.rank === '1')
    return { 
      latestRaceName: race.raceName, 
      fastestLap: fl ? { 
        time: fl.FastestLap.Time.time, 
        driver: fl.Driver.familyName, 
        team: getTeamDisplayName(fl.Constructor.constructorId, fl.Constructor.name, season) 
      } : null 
    }
  } catch (error) { 
    console.error('Error fetching race stats:', error); 
    return null; 
  }
}

export const getLiveSessionControl = async (location, sessionName) => {
  try {
    const season = await getActiveSeason()
    // 1. Get meeting key
    const meetingsRes = await axios.get(`https://api.openf1.org/v1/meetings?year=${season}&location=${encodeURIComponent(location)}`)
    const meeting = meetingsRes.data?.[0]
    if (!meeting) return null
    
    // 2. Get session key
    const sessionsRes = await axios.get(`https://api.openf1.org/v1/sessions?meeting_key=${meeting.meeting_key}&session_name=${encodeURIComponent(sessionName)}`)
    const session = sessionsRes.data?.[0]
    if (!session) return null
    
    // 3. Get race control messages
    const raceControlRes = await axios.get(`https://api.openf1.org/v1/race_control?session_key=${session.session_key}`)
    const messages = raceControlRes.data || []
    
    // 4. Parse the latest status from messages
    let status = 'none' // Can be: 'none', 'red_flag', 'safety_car', 'vsc', 'chequered_flag'
    
    for (const msg of messages) {
      const text = String(msg.message).toUpperCase()
      
      if (text.includes('RED FLAG')) {
        status = 'red_flag'
      } else if (text.includes('SAFETY CAR DEPLOYED')) {
        status = 'safety_car'
      } else if (text.includes('VIRTUAL SAFETY CAR DEPLOYED')) {
        status = 'vsc'
      } else if (text.includes('TRACK CLEAR') || text.includes('CLEAR IN TRACK') || text.includes('SAFETY CAR IN THIS LAP')) {
        if (status === 'safety_car' || status === 'vsc') {
          status = 'none'
        }
      } else if (text.includes('CHEQUERED FLAG')) {
        status = 'chequered_flag'
      } else if (text.includes('RESUMED') || text.includes('TRACK CLEAR') || text.includes('RE-START')) {
        if (status === 'red_flag') {
          status = 'none'
        }
      }
    }
    
    return {
      status,
      sessionKey: session.session_key
    }
  } catch (err) {
    console.error(`Error fetching live session control status:`, err)
    return null
  }
}
