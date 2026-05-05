import { useEffect } from 'react'
import Layout from './layout/Layout'
import useStore, { getTeamTheme } from './store/useStore'
import { getStandings, getNextRace, getCalendar } from './services/f1Service'

function App() {
  const teamTheme = useStore(getTeamTheme)
  const setStandings = useStore(state => state.setStandings)
  const setRace = useStore(state => state.setRace)
  const setCalendar = useStore(state => state.setCalendar)
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

    // Initial load
    fetchStandings()
    fetchNextRace()
    fetchCalendar()

    // Background polling
    const standingsInterval = setInterval(fetchStandings, 5 * 60 * 1000)
    const raceInterval = setInterval(fetchNextRace, 10 * 60 * 1000)
    const calendarInterval = setInterval(fetchCalendar, 30 * 60 * 1000)

    // Cleanup to prevent duplicate intervals
    return () => {
      clearInterval(standingsInterval)
      clearInterval(raceInterval)
      clearInterval(calendarInterval)
    }
  }, [setStandings, setRace, setCalendar, setLoading, setError])

  return (
    <div className={`app theme-${teamTheme}`}>
      <Layout />
    </div>
  )
}

export default App
