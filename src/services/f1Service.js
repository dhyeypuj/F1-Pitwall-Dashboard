import axios from 'axios'
import { ERGAST_API_BASE } from '../config/api'

const BASE_URL = ERGAST_API_BASE

export const RACE_METADATA_2026 = {
  australia: { round: 1, countryCode: "AU", title: "Australian Grand Prix", circuit: "Albert Park Circuit", location: "Melbourne, Australia", laps: 58, distanceKm: 306.124, lapRecord: "1:19.813", lapRecordHolder: "Charles Leclerc", previousPole: "Max Verstappen", dates: "Mar 6 – 8", winner: "G. Russell" },
  china: { round: 2, countryCode: "CN", title: "Chinese Grand Prix", circuit: "Shanghai International Circuit", location: "Shanghai, China", laps: 56, distanceKm: 305.066, lapRecord: "1:32.238", lapRecordHolder: "Michael Schumacher", previousPole: "Lando Norris", dates: "Mar 13 – 15", winner: "A. Antonelli" },
  japan: { round: 3, countryCode: "JP", title: "Japanese Grand Prix", circuit: "Suzuka Circuit", location: "Suzuka, Japan", laps: 53, distanceKm: 307.471, lapRecord: "1:30.983", lapRecordHolder: "Lewis Hamilton", previousPole: "Max Verstappen", dates: "Apr 3 – 5", winner: "A. Antonelli" },
  miami: { round: 4, countryCode: "US", title: "Miami Grand Prix", circuit: "Miami International Autodrome", location: "Miami, United States", venue: "Hard Rock Stadium", laps: 57, distanceKm: 308.326, lapRecord: "1:29.708", lapRecordHolder: "Max Verstappen", previousPole: "Max Verstappen", dates: "May 1 – 3", winner: "A. Antonelli" },
  canada: { round: 5, countryCode: "CA", title: "Canadian Grand Prix", circuit: "Circuit Gilles Villeneuve", location: "Montreal, Canada", laps: 70, distanceKm: 305.27, lapRecord: "1:13.078", lapRecordHolder: "Valtteri Bottas", previousPole: "George Russell", dates: "May 22 – 24" },
  monaco: { round: 6, countryCode: "MC", title: "Monaco Grand Prix", circuit: "Circuit de Monaco", location: "Monte Carlo, Monaco", laps: 78, distanceKm: 260.286, lapRecord: "1:12.909", lapRecordHolder: "Lewis Hamilton", previousPole: "Charles Leclerc", dates: "Jun 5 – 7" },
  spain_madrid: { round: 7, countryCode: "ES", title: "Spanish Grand Prix", circuit: "Madrid", location: "Madrid, Spain", laps: 57, distanceKm: 309.7, lapRecord: "—", lapRecordHolder: "—", previousPole: "—", dates: "Jun 12 – 14" },
  austria: { round: 8, countryCode: "AT", title: "Austrian Grand Prix", circuit: "Red Bull Ring", location: "Spielberg, Austria", laps: 71, distanceKm: 306.452, lapRecord: "1:05.619", lapRecordHolder: "Carlos Sainz", previousPole: "Max Verstappen", dates: "Jun 26 – 28" },
  britain: { round: 9, countryCode: "GB", title: "British Grand Prix", circuit: "Silverstone Circuit", location: "Silverstone, United Kingdom", laps: 52, distanceKm: 306.198, lapRecord: "1:27.097", lapRecordHolder: "Max Verstappen", previousPole: "George Russell", dates: "Jul 3 – 5" },
  belgium: { round: 10, countryCode: "BE", title: "Belgian Grand Prix", circuit: "Circuit de Spa-Francorchamps", location: "Stavelot, Belgium", laps: 44, distanceKm: 308.052, lapRecord: "1:44.701", lapRecordHolder: "Sergio Pérez", previousPole: "Charles Leclerc", dates: "Jul 17 – 19" },
  hungary: { round: 11, countryCode: "HU", title: "Hungarian Grand Prix", circuit: "Hungaroring", location: "Budapest, Hungary", laps: 70, distanceKm: 306.63, lapRecord: "1:16.627", lapRecordHolder: "Lewis Hamilton", previousPole: "Lando Norris", dates: "Jul 24 – 26" },
  netherlands: { round: 12, countryCode: "NL", title: "Dutch Grand Prix", circuit: "Circuit Zandvoort", location: "Zandvoort, Netherlands", laps: 72, distanceKm: 306.587, lapRecord: "1:11.097", lapRecordHolder: "Lewis Hamilton", previousPole: "Lando Norris", dates: "Aug 21 – 23" },
  italy_monza: { round: 13, countryCode: "IT", title: "Italian Grand Prix", circuit: "Autodromo Nazionale Monza", location: "Monza, Italy", laps: 53, distanceKm: 306.72, lapRecord: "1:21.046", lapRecordHolder: "Rubens Barrichello", previousPole: "Lando Norris", dates: "Sep 4 – 6" },
  spain_barcelona: { round: 14, countryCode: "ES", title: "Barcelona Grand Prix", circuit: "Circuit de Barcelona-Catalunya", location: "Barcelona, Spain", laps: 66, distanceKm: 307.236, lapRecord: "1:16.330", lapRecordHolder: "Max Verstappen", previousPole: "Lando Norris", dates: "Sep 11 – 13" },
  azerbaijan: { round: 15, countryCode: "AZ", title: "Azerbaijan Grand Prix", circuit: "Baku City Circuit", location: "Baku, Azerbaijan", laps: 51, distanceKm: 306.049, lapRecord: "1:43.009", lapRecordHolder: "Charles Leclerc", previousPole: "Charles Leclerc", dates: "Sep 25 – 27" },
  singapore: { round: 16, countryCode: "SG", title: "Singapore Grand Prix", circuit: "Marina Bay Street Circuit", location: "Singapore", laps: 62, distanceKm: 306.143, lapRecord: "1:34.486", lapRecordHolder: "Daniel Ricciardo", previousPole: "Charles Leclerc", dates: "Oct 9 – 11" },
  unitedStates: { round: 17, countryCode: "US", title: "United States Grand Prix", circuit: "Circuit of the Americas", location: "Austin, United States", laps: 56, distanceKm: 308.405, lapRecord: "1:36.169", lapRecordHolder: "Charles Leclerc", previousPole: "Lando Norris", dates: "Oct 23 – 25" },
  mexico: { round: 18, countryCode: "MX", title: "Mexico City Grand Prix", circuit: "Autódromo Hermanos Rodríguez", location: "Mexico City, Mexico", laps: 71, distanceKm: 305.354, lapRecord: "1:17.774", lapRecordHolder: "Valtteri Bottas", previousPole: "Carlos Sainz", dates: "Oct 30 – Nov 1" },
  brazil: { round: 19, countryCode: "BR", title: "São Paulo Grand Prix", circuit: "Interlagos", location: "São Paulo, Brazil", laps: 71, distanceKm: 305.879, lapRecord: "1:10.540", lapRecordHolder: "Valtteri Bottas", previousPole: "Max Verstappen", dates: "Nov 6 – 8" },
  lasVegas: { round: 20, countryCode: "US", title: "Las Vegas Grand Prix", circuit: "Las Vegas Strip Circuit", location: "Las Vegas, United States", laps: 50, distanceKm: 305.88, lapRecord: "1:35.490", lapRecordHolder: "Oscar Piastri", previousPole: "George Russell", dates: "Nov 19 – 21" },
  qatar: { round: 21, countryCode: "QA", title: "Qatar Grand Prix", circuit: "Lusail International Circuit", location: "Lusail, Qatar", laps: 57, distanceKm: 308.611, lapRecord: "1:22.384", lapRecordHolder: "Lando Norris", previousPole: "Max Verstappen", dates: "Nov 27 – 29" },
  abuDhabi: { round: 22, countryCode: "AE", title: "Abu Dhabi Grand Prix", circuit: "Yas Marina Circuit", location: "Abu Dhabi, UAE", laps: 58, distanceKm: 306.183, lapRecord: "1:26.103", lapRecordHolder: "Max Verstappen", previousPole: "Max Verstappen", dates: "Dec 4 – 6" }
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

const getTeamDisplayName = (id) => {
  const names = { ferrari: 'Scuderia Ferrari HP', mercedes: 'Mercedes-AMG PETRONAS Formula One Team', red_bull: 'Oracle Red Bull Racing', redbull: 'Oracle Red Bull Racing', mclaren: 'McLaren Formula 1 Team', aston_martin: 'Aston Martin Aramco Formula One Team', astonmartin: 'Aston Martin Aramco Formula One Team', williams: 'Atlassian Williams Racing', alpine: 'BWT Alpine Formula One Team', haas: 'MoneyGram Haas F1 Team', rb: 'Visa Cash App Racing Bulls F1 Team', racingbulls: 'Visa Cash App Racing Bulls F1 Team', vcarb: 'Visa Cash App Racing Bulls F1 Team', sauber: 'Audi F1 Team', audi: 'Audi F1 Team', andretti: 'Cadillac Formula 1 Team', cadillac: 'Cadillac Formula 1 Team' }
  const sid = String(id).toLowerCase().replace(/\s+/g, '_')
  return names[sid] || id
}

const getTeamPU = (id) => {
  const pus = { ferrari: 'Ferrari S.p.A.', haas: 'Ferrari S.p.A.', cadillac: 'Ferrari S.p.A.', andretti: 'Ferrari S.p.A.', mercedes: 'Mercedes-AMG High Performance Powertrains', mclaren: 'Mercedes-AMG High Performance Powertrains', williams: 'Mercedes-AMG High Performance Powertrains', alpine: 'Mercedes-AMG High Performance Powertrains', red_bull: 'Red Bull Ford Powertrains', redbull: 'Red Bull Ford Powertrains', rb: 'Red Bull Ford Powertrains', vcarb: 'Red Bull Ford Powertrains', racingbulls: 'Red Bull Ford Powertrains', aston_martin: 'Honda Racing Corporation', astonmartin: 'Honda Racing Corporation', audi: 'Audi Formula Racing GmbH', sauber: 'Audi Formula Racing GmbH' }
  const sid = String(id).toLowerCase().replace(/\s+/g, '_')
  return pus[sid] || 'Internal Power Unit'
}

const getTeamLogo = (id) => {
  const mapping = { mercedes: 'mercedes', red_bull: 'red-bull-racing', ferrari: 'ferrari', mclaren: 'mclaren', aston_martin: 'aston-martin', alpine: 'alpine', haas: 'haas', williams: 'williams', rb: 'vcarb', sauber: 'audi', andretti: 'cadillac' }
  return `/assets/logos/${(mapping[id] || id.replace('_', '-'))}.png`
}

const getTeamColor = (id) => {
  const colors = { mercedes: 'var(--mercedes)', red_bull: 'var(--redbull)', ferrari: 'var(--ferrari)', mclaren: 'var(--mclaren)', aston_martin: 'var(--astonmartin)', alpine: 'var(--alpine)', haas: 'var(--haas)', williams: 'var(--williams)', rb: 'var(--racingbulls)', sauber: 'var(--audi)', andretti: 'var(--cadillac)' }
  return colors[id] || '#666'
}

export const getNextRace = async () => {
  try {
    // For 2026 Concept, we use our static metadata as the source of truth
    const now = new Date('2026-05-07T00:00:00Z') // Current concept date
    const races = Object.values(RACE_METADATA_2026)
    
    // Convert metadata dates into real Date objects for comparison
    // Australia is Mar 6-8, China is Mar 13-15, etc.
    // Let's find the first race whose date is in the future relative to our concept date
    const raceMeta = races.find(m => {
      const raceMonth = m.dates.split(' ')[0]
      const raceDay = m.dates.split(' ')[1]
      const raceDateStr = `2026-${raceMonth}-${raceDay}`.replace('Mar', '03').replace('Apr', '04').replace('May', '05').replace('Jun', '06')
      return new Date(raceDateStr) > now
    }) || races[4] // Fallback to Canada (Round 5) if none found or for demo

    // Pull the start date from m.dates (e.g., "May 22 – 24")
    const raceMonth = raceMeta.dates.split(' ')[0]
    const raceDay = raceMeta.dates.split(' ')[1]
    const monthMap = { 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' }
    const isoDate = `2026-${monthMap[raceMonth]}-${raceDay.padStart(2, '0')}T14:00:00Z`

    return {
      name: raceMeta.title,
      round: `Round ${String(raceMeta.round).padStart(2, '0')}`,
      status: 'Up Next',
      flag: '🏁',
      city: raceMeta.location.split(',')[0],
      country: raceMeta.location.split(', ')[1],
      title: raceMeta.title,
      countryCode: raceMeta.countryCode,
      circuit: raceMeta.circuit,
      location: raceMeta.location,
      venue: raceMeta.location,
      roundNumber: raceMeta.round,
      date: isoDate, 
      details: `Round ${raceMeta.round} · ${raceMeta.circuit}`,
      laps: raceMeta.laps,
      distance: raceMeta.distanceKm,
      lapRecord: raceMeta.lapRecord !== "—" ? `${raceMeta.lapRecord} · ${raceMeta.lapRecordHolder}` : "—",
      previousPole: raceMeta.previousPole,
      dates: raceMeta.dates,
      stats: [
        { label: "Laps", value: raceMeta.laps },
        { label: "Distance", value: `${raceMeta.distanceKm} km` },
        { label: "Record", value: raceMeta.lapRecord !== "—" ? `${raceMeta.lapRecord} · ${raceMeta.lapRecordHolder}` : "—" },
        { label: "Prev. Pole", value: raceMeta.previousPole }
      ]
    }
  } catch (error) {
    console.error('Error fetching next race:', error)
    return null
  }
}

export const getStandings = async () => {
  try {
    const [driversRes, constructorsRes] = await Promise.all([fetchCached(`${BASE_URL}/2026/driverStandings.json`), fetchCached(`${BASE_URL}/2026/constructorStandings.json`)])
    const rawDrivers = driversRes.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []
    const rawConstructors = constructorsRes.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || []
    const drivers = rawDrivers.map((d, i) => ({ 
      pos: String(d.position).padStart(2, '0'), 
      name: `${d.Driver.givenName[0]}. ${d.Driver.familyName}`, 
      code: d.Driver.code || d.Driver.familyName.substring(0, 3).toUpperCase(), 
      team: getTeamDisplayName(d.Constructors[0]?.constructorId) || 'Unknown', 
      nationality: d.Driver.nationality, 
      flagUrl: getFlagUrl(d.Driver.nationality), 
      logoUrl: getTeamLogo(d.Constructors[0]?.constructorId), 
      points: Number(d.points), 
      gap: i === 0 ? null : `−${rawDrivers[0].points - d.points}`, 
      width: rawDrivers.length > 0 ? `${Math.round((Number(d.points) / Number(rawDrivers[0].points)) * 100)}%` : '0%',
      color: getTeamColor(d.Constructors[0]?.constructorId), 
      codeBg: getTeamColor(d.Constructors[0]?.constructorId), 
      codeColor: '#fff' 
    }))
    const maxPts = rawConstructors.length > 0 ? Number(rawConstructors[0].points) : 100
    const constructors = rawConstructors.map(c => ({ pos: String(c.position).padStart(2, '0'), name: getTeamDisplayName(c.Constructor.constructorId), engine: getTeamPU(c.Constructor.constructorId), nationality: c.Constructor.nationality, flagUrl: getFlagUrl(c.Constructor.nationality), logoUrl: getTeamLogo(c.Constructor.constructorId), points: Number(c.points), width: maxPts > 0 ? `${Math.round((Number(c.points) / maxPts) * 100)}%` : '0%', color: getTeamColor(c.Constructor.constructorId) }))
    return { drivers, constructors }
  } catch (error) { console.error('Error fetching standings:', error); throw new Error('Failed to load standings'); }
}

export const getCalendar = async () => {
  try {
    // Parallel fetch for calendar rounds and actual race results
    const [calendarRes, resultsRes] = await Promise.all([
      fetchCached(`${BASE_URL}/2026.json`),
      fetchCached(`${BASE_URL}/2026/results.json?limit=100`).catch(() => ({ data: { MRData: { RaceTable: { Races: [] } } } }))
    ]).catch(() => [{ data: { MRData: { RaceTable: { Races: [] } } } }, { data: { MRData: { RaceTable: { Races: [] } } } }])

    const apiResults = resultsRes.data?.MRData?.RaceTable?.Races || []
    // Create a map for quick lookup: round -> winner name
    const resultsMap = new Map(apiResults.map(r => [
      Number(r.round), 
      `${r.Results[0].Driver.givenName[0]}. ${r.Results[0].Driver.familyName}`
    ]))

    const now = new Date('2026-05-07T00:00:00Z')
    const raceSource = Object.values(RACE_METADATA_2026)
    
    const processedRounds = raceSource.map(m => {
      const raceMonth = m.dates.split(' ')[0]
      const raceDay = m.dates.split(' ')[1]
      const monthMap = { 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12' }
      const raceDateStr = `2026-${monthMap[raceMonth]}-${raceDay.padStart(2, '0')}T14:00:00Z`
      const raceDate = new Date(raceDateStr)
      
      const isPast = raceDate < now
      const isNext = m.round === 5 

      return {
        id: m.round,
        round: m.round,
        num: `R${String(m.round).padStart(2, '0')}${isNext ? ' · NEXT' : ''}`,
        country: m.location.split(', ').pop(),
        name: m.title,
        circuit: m.circuit,
        date: m.dates,
        status: isPast ? 'DONE' : (isNext ? 'UP NEXT' : 'UPCOMING'),
        done: isPast,
        next: isNext,
        emoji: '🏁',
        flagUrl: `https://flagcdn.com/w80/${m.countryCode.toLowerCase()}.png`,
        // Prioritize API results, fallback to metadata winner, then TBD if past
        winner: resultsMap.get(m.round) || m.winner || (isPast ? 'TBD' : '')
      }
    })

    return {
      meta: `${raceSource.length} Rounds · Mar → Dec 2026`,
      progress: `${Math.round((processedRounds.filter(r => r.done).length / raceSource.length) * 100)}%`,
      rounds: processedRounds
    }
  } catch (error) {
    console.error('Error fetching calendar:', error)
    return { meta: '22 Rounds · 2026', progress: '0%', rounds: [] }
  }
}

export const getLatestResults = async () => {
  try {
    const { data } = await fetchCached(`${BASE_URL}/2026/last/results.json`)
    const race = data.MRData.RaceTable.Races[0]
    if (!race || !race.Results) return { title: '', results: [], winner: null }
    const top3 = race.Results.slice(0, 3).map((r, i) => { const cid = r.Constructor.constructorId; return { id: `p${i + 1}`, cls: `p${i + 1}`, badge: `P${i + 1}`, name: `${r.Driver.givenName} ${r.Driver.familyName}`, team: `${getTeamDisplayName(cid)} · #${r.number}`, nationality: r.Driver.nationality, flagUrl: getFlagUrl(r.Driver.nationality), logoUrl: getTeamLogo(cid), color: getTeamColor(cid), time: i === 0 ? r.Time?.time || 'Winner' : r.Time?.time || `+${r.Time?.millis}ms` } })
    return { title: `${race.raceName} · ${race.Circuit.Location.locality} · Result`, results: top3, winner: { ...race.Results[0], Constructor: { ...race.Results[0].Constructor, name: getTeamDisplayName(race.Results[0].Constructor.constructorId) } } }
  } catch (error) { console.error('Error fetching latest results:', error); return { title: '', results: [], winner: null }; }
}

export const getRaceStats = async () => {
  try {
    const { data } = await fetchCached(`${BASE_URL}/2026/last/results.json`)
    const race = data.MRData.RaceTable.Races[0]
    if (!race || !race.Results) return null
    const fl = race.Results.find(r => r.FastestLap?.rank === '1')
    return { latestRaceName: race.raceName, fastestLap: fl ? { time: fl.FastestLap.Time.time, driver: fl.Driver.familyName, team: getTeamDisplayName(fl.Constructor.constructorId) } : null }
  } catch (error) { console.error('Error fetching race stats:', error); return null; }
}
