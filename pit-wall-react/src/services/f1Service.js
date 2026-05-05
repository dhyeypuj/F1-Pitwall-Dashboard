import axios from 'axios'

const BASE_URL = 'https://api.jolpi.ca/ergast/f1'

export const getNextRace = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/current/next.json`)
    const race = data.MRData.RaceTable.Races[0]
    
    if (!race) return null

    return {
      round: `Round ${String(race.round).padStart(2, '0')}`,
      status: 'Up Next',
      city: race.Circuit.Location.locality,
      country: race.Circuit.Location.country,
      title: race.raceName,
      circuit: race.Circuit.circuitName,
      date: `${race.date}T${race.time || '00:00:00Z'}`,
    }
  } catch (error) {
    console.error('Error fetching next race:', error)
    return null
  }
}

export const getStandings = async () => {
  try {
    const [driversRes, constructorsRes] = await Promise.all([
      axios.get(`${BASE_URL}/current/driverStandings.json`),
      axios.get(`${BASE_URL}/current/constructorStandings.json`)
    ])

    const rawDrivers = driversRes.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || []
    const rawConstructors = constructorsRes.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || []

    const drivers = rawDrivers.map(d => ({
      pos: String(d.position).padStart(2, '0'),
      name: `${d.Driver.givenName[0]}. ${d.Driver.familyName}`,
      code: d.Driver.code || d.Driver.familyName.substring(0, 3).toUpperCase(),
      team: d.Constructors[0]?.name,
      nationality: d.Driver.nationality,
      points: Number(d.points),
      constructorId: d.Constructors[0]?.constructorId
    }))

    const maxPts = rawConstructors.length > 0 ? Number(rawConstructors[0].points) : 100

    const constructors = rawConstructors.map(c => ({
      pos: String(c.position).padStart(2, '0'),
      name: c.Constructor.name,
      nationality: c.Constructor.nationality,
      points: Number(c.points),
      width: maxPts > 0 ? `${Math.round((Number(c.points) / maxPts) * 100)}%` : '0%',
      constructorId: c.Constructor.constructorId
    }))

    return { drivers, constructors }
  } catch (error) {
    console.error('Error fetching standings:', error)
    return { drivers: [], constructors: [] }
  }
}

export const getCalendar = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/current.json`)
    const races = data.MRData.RaceTable.Races || []

    return races.map(r => {
      const raceDate = new Date(`${r.date}T${r.time || '00:00:00Z'}`)
      const isPast = raceDate < new Date()

      return {
        id: r.round,
        num: `R${String(r.round).padStart(2, '0')}`,
        country: r.Circuit.Location.country,
        name: r.Circuit.circuitName,
        date: r.date,
        time: r.time,
        status: isPast ? 'DONE' : 'UPCOMING',
        done: isPast
      }
    })
  } catch (error) {
    console.error('Error fetching calendar:', error)
    return []
  }
}
