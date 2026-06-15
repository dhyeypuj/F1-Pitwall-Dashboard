import axios from 'axios'
import { ERGAST_API_BASE } from '../config/api'
import { getRaceMetadata } from '../config/raceMetadata'
import { logger } from './logger'
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
    ferrari: 'Ferrari', 
    mercedes: 'Mercedes', 
    red_bull: 'Red Bull Racing', 
    redbull: 'Red Bull Racing', 
    mclaren: 'McLaren', 
    aston_martin: 'Aston Martin', 
    astonmartin: 'Aston Martin', 
    williams: 'Williams', 
    alpine: 'Alpine', 
    haas: 'Haas', 
    rb: 'Racing Bulls', 
    racingbulls: 'Racing Bulls', 
    vcarb: 'Racing Bulls', 
    sauber: 'Audi', 
    kick_sauber: 'Audi',
    alphatauri: 'Scuderia AlphaTauri',
    torro_rosso: 'Scuderia Toro Rosso',
    force_india: 'Sahara Force India F1 Team',
    racing_point: 'SportPesa Racing Point F1 Team',
    renault: 'Renault DP World F1 Team',
    audi: 'Audi', 
    andretti: 'Cadillac', 
    cadillac: 'Cadillac' 
  }
  
  if (year < 2026) {
    names.ferrari = 'Scuderia Ferrari'
    names.williams = 'Williams Racing'
    names.sauber = 'Stake F1 Team Kick Sauber'
    names.kick_sauber = 'Stake F1 Team Kick Sauber'
    names.audi = 'Audi F1 Team'
    names.andretti = 'Andretti Cadillac'
    names.cadillac = 'Andretti Cadillac'
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
    "c. leclerc": "chalec01",
    "lewis hamilton": "lewham01",
    "l. hamilton": "lewham01",
    "max verstappen": "maxver01",
    "m. verstappen": "maxver01",
    "lando norris": "lannor01",
    "l. norris": "lannor01",
    "oscar piastri": "oscpia01",
    "o. piastri": "oscpia01",
    "george russell": "georus01",
    "g. russell": "georus01",
    "andrea kimi antonelli": "andant01",
    "kimi antonelli": "andant01",
    "a. antonelli": "andant01",
    "k. antonelli": "andant01",
    "carlos sainz": "carsai01",
    "c. sainz": "carsai01",
    "alexander albon": "alealb01",
    "alex albon": "alealb01",
    "a. albon": "alealb01",
    "pierre gasly": "piegas01",
    "p. gasly": "piegas01",
    "franco colapinto": "fracol01",
    "f. colapinto": "fracol01",
    "esteban ocon": "estoco01",
    "e. ocon": "estoco01",
    "oliver bearman": "olibea01",
    "o. bearman": "olibea01",
    "liam lawson": "lialaw01",
    "l. lawson": "lialaw01",
    "arvid lindblad": "arvlin01",
    "a. lindblad": "arvlin01",
    "nico hulkenberg": "nichul01",
    "nico hülkenberg": "nichul01",
    "n. hulkenberg": "nichul01",
    "n. hülkenberg": "nichul01",
    "gabriel bortoleto": "gabbor01",
    "g. bortoleto": "gabbor01",
    "sergio perez": "serper01",
    "sergio pérez": "serper01",
    "s. perez": "serper01",
    "s. pérez": "serper01",
    "valtteri bottas": "valbot01",
    "v. bottas": "valbot01",
    "fernando alonso": "feralo01",
    "f. alonso": "feralo01",
    "lance stroll": "lanstr01",
    "l. stroll": "lanstr01",
    "isack hadjar": "isahad01",
    "i. hadjar": "isahad01"
  }
  
  const code = driverCodes[normName] || (normName.split(' ')[0].substring(0,3) + normName.split(' ').pop().substring(0,3) + '01')
  const wasInMap = !!driverCodes[normName]
  
  const url = `https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/d_common:f1:${year}:fallback:driver:${year}fallbackdriverfront.webp/v1740000001/common/f1/${year}/${team}/${code}/${year}${team}${code}front.webp`
  
  logger.debug(`[DriverImage] Resolved image URL`, {
    input: { driverName, constructorId, season: year },
    resolved: { normName, team, code, codeFromMap: wasInMap },
    url
  })
  
  return url
}

/**
 * Returns the URL to a driver's official stylized number image from the F1 CDN.
 * These are the same team-branded number graphics used on formula1.com.
 * @param {string} driverName - Full driver name (e.g. "Lando Norris") or abbreviated (e.g. "L. Norris")
 * @param {string} constructorId - Constructor/team ID (e.g. "mclaren", "ferrari")
 * @param {string|number} [season] - Season year (defaults to active season)
 * @returns {string} URL to the driver number image on the F1 CDN
 */
export const getDriverNumberImage = (driverName, constructorId, season = getActiveSeasonSync()) => {
  const normName = driverName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  
  const driverCodes = {
    "charles leclerc": "chalec01",
    "c. leclerc": "chalec01",
    "lewis hamilton": "lewham01",
    "l. hamilton": "lewham01",
    "max verstappen": "maxver01",
    "m. verstappen": "maxver01",
    "lando norris": "lannor01",
    "l. norris": "lannor01",
    "oscar piastri": "oscpia01",
    "o. piastri": "oscpia01",
    "george russell": "georus01",
    "g. russell": "georus01",
    "andrea kimi antonelli": "andant01",
    "kimi antonelli": "andant01",
    "a. antonelli": "andant01",
    "k. antonelli": "andant01",
    "carlos sainz": "carsai01",
    "c. sainz": "carsai01",
    "alexander albon": "alealb01",
    "alex albon": "alealb01",
    "a. albon": "alealb01",
    "pierre gasly": "piegas01",
    "p. gasly": "piegas01",
    "franco colapinto": "fracol01",
    "f. colapinto": "fracol01",
    "esteban ocon": "estoco01",
    "e. ocon": "estoco01",
    "oliver bearman": "olibea01",
    "o. bearman": "olibea01",
    "liam lawson": "lialaw01",
    "l. lawson": "lialaw01",
    "arvid lindblad": "arvlin01",
    "a. lindblad": "arvlin01",
    "nico hulkenberg": "nichul01",
    "n. hulkenberg": "nichul01",
    "gabriel bortoleto": "gabbor01",
    "g. bortoleto": "gabbor01",
    "sergio perez": "serper01",
    "s. perez": "serper01",
    "valtteri bottas": "valbot01",
    "v. bottas": "valbot01",
    "fernando alonso": "feralo01",
    "f. alonso": "feralo01",
    "lance stroll": "lanstr01",
    "l. stroll": "lanstr01",
    "isack hadjar": "isahad01",
    "i. hadjar": "isahad01"
  }

  const code = driverCodes[normName] || (normName.split(' ')[0].substring(0,3) + normName.split(' ').pop().substring(0,3) + '01')
  
  const driverNumbers = {
    lannor01: '1-norris',
    oscpia01: '81-piastri',
    maxver01: '3-verstappen',
    isahad01: '6-hadjar',
    chalec01: '16-leclerc',
    lewham01: '44-hamilton',
    georus01: '63-russell',
    andant01: '12-antonelli',
    carsai01: '55-sainz',
    alealb01: '23-albon',
    feralo01: '14-alonso',
    lanstr01: '18-stroll',
    piegas01: '10-gasly',
    fracol01: '43-colapinto',
    estoco01: '31-ocon',
    olibea01: '87-bearman',
    lialaw01: '30-lawson',
    arvlin01: '41-lindblad',
    nichul01: '27-hulkenberg',
    gabbor01: '5-bortoleto',
    serper01: '11-perez',
    valbot01: '77-bottas'
  }

  const filenameKey = driverNumbers[code]
  if (filenameKey) {
    return `/assets/driver-numbers/${filenameKey}.svg`
  }

  const year = Number(season) || 2026
  const team = getCdnConstructorPath(constructorId)
  return `https://media.formula1.com/image/upload/c_fit,w_876,h_742/q_auto/v1740000001/common/f1/${year}/${team}/${code}/${year}${team}${code}numberwhitefrless.webp`
}

/**
 * Validates whether a driver image URL actually resolves to a real asset.
 * Performs a HEAD request and logs diagnostics about the CDN response.
 * Call this from browser DevTools: window.__validateDriverImages()
 */
export const validateDriverImageUrl = async (driverName, constructorId, season) => {
  const url = getDriverImage(driverName, constructorId, season)
  const year = Number(season) || Number(getActiveSeasonSync()) || 2026
  const team = getCdnConstructorPath(constructorId)
  const normName = driverName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

  // Build alternate URLs to test different failure hypotheses
  const urlWithoutVersion = url.replace('/v1740000001/', '/')
  const urlWithoutFallback = `https://media.formula1.com/image/upload/c_lfill,w_440/q_auto/v1740000001/common/f1/${year}/${team}/${normName.split(' ')[0].substring(0,3)}${normName.split(' ').pop().substring(0,3)}01/${year}${team}${normName.split(' ')[0].substring(0,3)}${normName.split(' ').pop().substring(0,3)}01front.webp`

  const results = {}
  const testUrls = {
    'original (with version + fallback)': url,
    'without version (latest)': urlWithoutVersion,
  }

  for (const [label, testUrl] of Object.entries(testUrls)) {
    try {
      const resp = await fetch(testUrl, { method: 'HEAD' })
      const contentType = resp.headers.get('content-type') || 'unknown'
      const contentLength = resp.headers.get('content-length') || 'unknown'
      results[label] = {
        status: resp.status,
        ok: resp.ok,
        contentType,
        contentLength,
        isFallback: contentLength !== 'unknown' && Number(contentLength) < 5000, // Fallback silhouette is typically very small
        url: testUrl
      }
    } catch (err) {
      results[label] = { error: err.message, url: testUrl }
    }
  }

  const diagnosis = []
  const orig = results['original (with version + fallback)']
  const noVer = results['without version (latest)']

  if (orig?.ok && noVer?.ok) {
    if (orig.isFallback && !noVer.isFallback) {
      diagnosis.push('STALE_VERSION: Version v1740000001 serves fallback; removing version resolves to actual asset')
    } else if (orig.isFallback && noVer.isFallback) {
      diagnosis.push('MISSING_ASSET: Both versioned and unversioned URLs serve fallback — asset may not exist for this driver/team/year')
    } else {
      diagnosis.push('OK: Original URL serves a real asset')
    }
  } else if (!orig?.ok) {
    diagnosis.push('CDN_ERROR: Original URL returned non-200')
  }

  const report = {
    driver: driverName,
    constructor: constructorId,
    season: year,
    team,
    results,
    diagnosis
  }

  logger.info(`[DriverImage Validation] ${driverName}`, report)
  console.table(Object.entries(results).map(([label, r]) => ({ label, ...r })))
  console.log('Diagnosis:', diagnosis.join('; '))

  return report
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
      previousWinner: meta.previousWinner,
      dates: formattedDates,
      stats: [
        { label: "Laps", value: meta.laps },
        { label: "Distance", value: `${meta.distanceKm} km` },
        { label: "Record", value: meta.lapRecord !== "—" ? `${meta.lapRecord} · ${meta.lapRecordHolder}` : "—" },
        { label: "Prev. Winner", value: meta.previousWinner }
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
      fullName: `${d.Driver.givenName} ${d.Driver.familyName}`,
      imageUrl: getDriverImage(`${d.Driver.givenName} ${d.Driver.familyName}`, d.Constructors[0]?.constructorId, season),
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

// Static records of completed race winners to minimize API hits and prevent invalid fallbacks
const RECORDED_RACE_WINNERS = {
  1: "G. Russell",     // Australia
  2: "A. Antonelli",   // China
  3: "A. Antonelli",   // Japan
  4: "A. Antonelli",   // Miami
  5: "M. Verstappen",  // Canada
  6: "C. Leclerc",     // Monaco
  7: "L. Hamilton"     // Spain / Barcelona
}

export const getCalendar = async () => {
  try {
    const season = await getActiveSeason()
    const [calendarRes, lastResultsRes] = await Promise.all([
      fetchCached(`${BASE_URL}/${season}.json`),
      fetchCached(`${BASE_URL}/${season}/last/results.json`).catch(() => null)
    ]).catch(() => [{ data: { MRData: { RaceTable: { Races: [] } } } }, null])

    const races = calendarRes.data?.MRData?.RaceTable?.Races || []
    
    // Extract the latest completed race details from API
    const lastRace = lastResultsRes?.data?.MRData?.RaceTable?.Races?.[0]
    const lastRoundNumber = lastRace ? Number(lastRace.round) : null
    const lastRaceWinnerName = lastRace?.Results?.[0]
      ? formatDriverNameAbbreviated(lastRace.Results[0].Driver.givenName, lastRace.Results[0].Driver.familyName)
      : null

    const now = new Date()
    const currentRound = getCurrentRound(races, now)

    const processedRounds = races.map(r => {
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
      const roundNum = Number(r.round)

      let winnerName = ''
      let winnerSource = null

      if (RECORDED_RACE_WINNERS[roundNum]) {
        winnerName = RECORDED_RACE_WINNERS[roundNum]
        winnerSource = 'static-record'
      } else if (roundNum === lastRoundNumber && lastRaceWinnerName) {
        winnerName = lastRaceWinnerName
        winnerSource = 'latest-api'
      } else if (isPast) {
        winnerName = 'TBD'
        winnerSource = 'fallback'
      }

      logger.debug(`[Calendar] Round ${r.round} winner resolved`, {
        round: roundNum,
        raceName: r.raceName,
        winner: winnerName,
        source: winnerSource,
        status: raceStatusVal
      })

      return {
        id: roundNum,
        round: roundNum,
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
    })

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

const sessionKeyCache = new Map()

export const getLiveSessionControl = async (location, sessionName) => {
  try {
    const season = await getActiveSeason()
    const cacheKey = `${season}_${location}_${sessionName}`
    let sessionKey = sessionKeyCache.get(cacheKey)
    
    if (!sessionKey) {
      // 1. Get meeting key
      const meetingsRes = await axios.get(`https://api.openf1.org/v1/meetings?year=${season}&location=${encodeURIComponent(location)}`)
      const meeting = meetingsRes.data?.[0]
      if (!meeting) return null
      
      // 2. Get session key
      const sessionsRes = await axios.get(`https://api.openf1.org/v1/sessions?meeting_key=${meeting.meeting_key}&session_name=${encodeURIComponent(sessionName)}`)
      const session = sessionsRes.data?.[0]
      if (!session) return null
      
      sessionKey = session.session_key
      sessionKeyCache.set(cacheKey, sessionKey)
    }
    
    // 3. Get race control messages
    const raceControlRes = await axios.get(`https://api.openf1.org/v1/race_control?session_key=${sessionKey}`)
    const messages = raceControlRes.data || []
    
    // 4. Parse the latest status from messages
    let status = 'none' // Can be: 'none', 'red_flag', 'safety_car', 'vsc', 'chequered_flag'
    
    for (const msg of messages) {
      const text = String(msg.message).toUpperCase()
      
      if (text.includes('CHEQUERED FLAG')) {
        status = 'chequered_flag'
      } else if (text.includes('VIRTUAL SAFETY CAR DEPLOYED')) {
        status = 'vsc'
      } else if (text.includes('SAFETY CAR DEPLOYED')) {
        status = 'safety_car'
      } else if (text.includes('RED FLAG')) {
        status = 'red_flag'
      } else if (text.includes('TRACK CLEAR') || text.includes('CLEAR IN TRACK') || text.includes('SAFETY CAR IN THIS LAP')) {
        if (status === 'safety_car' || status === 'vsc') {
          status = 'none'
        }
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
