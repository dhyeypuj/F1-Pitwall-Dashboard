import { useEffect } from 'react'
import Layout from './layout/Layout'
import useStore, { getTeamTheme } from './store/useStore'
import { getStandings, getNextRace, getCalendar, getLatestResults, getRaceStats } from './services/f1Service'
import { getF1News } from './services/newsService'

function App() {
  const teamTheme = useStore(getTeamTheme)
  const setStandings = useStore(state => state.setStandings)
  const setRace = useStore(state => state.setRace)
  const setCalendar = useStore(state => state.setCalendar)
  const setPodium = useStore(state => state.setPodium)
  const setRaceStats = useStore(state => state.setRaceStats)
  const setHeroStats = useStore(state => state.setHeroStats)
  const setTicker = useStore(state => state.setTicker)
  const setStats = useStore(state => state.setStats)
  const setNews = useStore(state => state.setNews)
  const standings = useStore(state => state.standings)
  const calendar = useStore(state => state.calendar)
  const podium = useStore(state => state.podium)
  const race = useStore(state => state.race)
  const raceStats = useStore(state => state.raceStats)
  const setLoading = useStore(state => state.setLoading)
  const setError = useStore(state => state.setError)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', teamTheme)
  }, [teamTheme])

  useEffect(() => {
    const fetchStandings = () => {
      getStandings().then(standings => {
        if (standings && standings.drivers && standings.drivers.length > 0) {
          setStandings(standings)
          setError('errorStandings', null)
        } else {
          setError('errorStandings', 'No standings available')
        }
        setLoading('isLoadingStandings', false)
      }).catch(err => {
        console.error('Failed to load standings:', err)
        setError('errorStandings', err.message || 'Failed to connect to Jolpica API')
        setLoading('isLoadingStandings', false)
      })
    }

    const fetchNextRace = () => {
      getNextRace().then(nextRace => {
        if (nextRace) {
          const currentRace = useStore.getState().race
          setRace({
            ...currentRace,
            nextRace: {
              ...currentRace.nextRace,
              ...nextRace
            },
            countdown: { targetDate: nextRace.date }
          })
          setError('errorRace', null)
        } else {
          setError('errorRace', 'No upcoming race data')
        }
        setLoading('isLoadingRace', false)
      }).catch(err => {
        console.error('Failed to load next race:', err)
        setError('errorRace', err.message || 'Failed to connect to Jolpica API')
        setLoading('isLoadingRace', false)
      })
    }

    const fetchCalendar = () => {
      getCalendar().then(calendar => {
        if (calendar && calendar.length > 0) {
          const currentCal = useStore.getState().calendar
          setCalendar({
            ...currentCal,
            rounds: calendar
          })
          setError('errorCalendar', null)
        } else {
          setError('errorCalendar', 'No calendar available')
        }
        setLoading('isLoadingCalendar', false)
      }).catch(err => {
        console.error('Failed to load calendar:', err)
        setError('errorCalendar', err.message || 'Failed to connect to Jolpica API')
        setLoading('isLoadingCalendar', false)
      })
    }

    const fetchResultsAndStats = () => {
      getLatestResults().then(podiumData => {
        if (podiumData && podiumData.results.length > 0) {
          setPodium(podiumData)
          setError('errorResults', null)
        } else {
          setError('errorResults', 'No recent results available')
        }
        setLoading('isLoadingResults', false)
      }).catch(err => {
        console.error('Failed to load results:', err)
        setError('errorResults', err.message || 'Failed to connect to Jolpica API')
        setLoading('isLoadingResults', false)
      })

      getRaceStats().then(statsData => {
        if (statsData) {
          setRaceStats(statsData)
          setError('errorStats', null)
        } else {
          setError('errorStats', 'No race stats available')
        }
        setLoading('isLoadingStats', false)
      }).catch(err => {
        console.error('Failed to load race stats:', err)
        setError('errorStats', err.message || 'Failed to connect to Jolpica API')
        setLoading('isLoadingStats', false)
      })
    }

    // Initial load
    fetchStandings()
    fetchNextRace()
    fetchCalendar()
    fetchResultsAndStats()

    // Background polling
    const standingsInterval = setInterval(fetchStandings, 5 * 60 * 1000)
    const raceInterval = setInterval(fetchNextRace, 10 * 60 * 1000)
    const calendarInterval = setInterval(fetchCalendar, 30 * 60 * 1000)
    const resultsInterval = setInterval(fetchResultsAndStats, 30 * 60 * 1000)

    // Cleanup to prevent duplicate intervals
    return () => {
      clearInterval(standingsInterval)
      clearInterval(raceInterval)
      clearInterval(calendarInterval)
      clearInterval(resultsInterval)
    }
  }, [setStandings, setRace, setCalendar, setPodium, setRaceStats, setLoading, setError])

  useEffect(() => {
    // Derive heroStats
    if (standings.drivers.length > 0 && calendar.rounds.length > 0) {
      setHeroStats([
        { val: standings.drivers[0].name.split(' ').pop(), lbl: "Championship Lead" },
        { val: standings.constructors[0].name, lbl: "Constructors' Cup" },
        { val: String(calendar.rounds.length), lbl: "Rounds" }
      ])
    }

    // Derive ticker
    if (standings.drivers.length > 0 && standings.constructors.length > 0 && race.nextRace && podium.winner && raceStats) {
      const topDriver = standings.drivers[0]
      const topConstructor = standings.constructors[0]
      const nextRace = race.nextRace
      const winner = podium.winner

      setTicker([
        { sym: 'WDC', val: topDriver.name.toUpperCase(), pts: `${topDriver.points} pts` },
        { sym: 'WCC', val: topConstructor.name.toUpperCase(), pts: `${topConstructor.points} pts` },
        { sym: 'NEXT', val: nextRace.city.toUpperCase(), pts: new Date(nextRace.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase() },
        { sym: 'WINNER', val: winner.Driver.familyName.toUpperCase(), pts: raceStats.latestRaceName.toUpperCase() },
        { sym: 'FL', val: raceStats.fastestLap?.driver.toUpperCase() || '--', pts: raceStats.fastestLap?.time || '--' },
        { sym: 'P2', val: standings.drivers[1]?.name.toUpperCase() || '--', pts: `${standings.drivers[1]?.points || 0} pts` },
        { sym: 'P3', val: standings.drivers[2]?.name.toUpperCase() || '--', pts: `${standings.drivers[2]?.points || 0} pts` },
        { sym: 'P4', val: standings.drivers[3]?.name.toUpperCase() || '--', pts: `${standings.drivers[3]?.points || 0} pts` }
      ])
    }

    // Derive stats
    if (standings.drivers.length > 1 && raceStats && podium.winner) {
      const p1 = standings.drivers[0]
      const p2 = standings.drivers[1]
      const gap = parseFloat(p1.points) - parseFloat(p2.points)

      setStats([
        { id: 1, label: "Championship Lead", bigHtml: `<em>+${gap}</em> pts`, sub: `${p1.name.split(' ').pop()} over ${p2.name.split(' ').pop()}` },
        { id: 2, label: `Fastest Lap ${new Date().getFullYear()}`, bigHtml: raceStats.fastestLap?.time || '--', sub: `${raceStats.fastestLap?.driver || '--'} · ${raceStats.latestRaceName}` },
        { id: 3, label: "Recent Winner", bigHtml: podium.winner.Driver.familyName, sub: `${podium.winner.Constructor.name} · ${raceStats.latestRaceName}` },
        { id: 4, label: "Next Race", bigHtml: race.nextRace ? race.nextRace.city : '--', sub: race.nextRace ? new Date(race.nextRace.date).toLocaleDateString() : '--' }
      ])
    }
  }, [standings, calendar, podium, race, raceStats, setHeroStats, setTicker, setStats])

  useEffect(() => {
    const fetchNews = () => {
      getF1News()
        .then(newsData => {
          if (newsData && newsData.length > 0) {
            setNews(newsData)
            setError('errorNews', null)
          } else {
            setError('errorNews', 'No recent F1 news available')
          }
          setLoading('isLoadingNews', false)
        })
        .catch(err => {
          console.error('Failed to fetch news:', err)
          setError('errorNews', err.message || 'Failed to connect to News API')
          setLoading('isLoadingNews', false)
        })
    }

    fetchNews()
    
    // Poll news every 60 minutes
    const newsInterval = setInterval(fetchNews, 60 * 60 * 1000)
    return () => clearInterval(newsInterval)
  }, [setNews, setLoading, setError])

  return (
    <div className={`app theme-${teamTheme}`}>
      <Layout />
    </div>
  )
}

export default App
