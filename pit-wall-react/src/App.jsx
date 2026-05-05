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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', teamTheme)
  }, [teamTheme])

  useEffect(() => {
    const loadData = () => {
      getStandings().then(standings => {
        if (standings && standings.drivers && standings.drivers.length > 0) {
          setStandings(standings)
        }
        setLoading('isLoadingStandings', false)
      }).catch(err => {
        console.error('Failed to load standings:', err)
        setLoading('isLoadingStandings', false)
      })

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
        }
        setLoading('isLoadingRace', false)
      }).catch(err => {
        console.error('Failed to load next race:', err)
        setLoading('isLoadingRace', false)
      })

      getCalendar().then(calendar => {
        if (calendar && calendar.length > 0) {
          const currentCal = useStore.getState().calendar
          setCalendar({
            ...currentCal,
            rounds: calendar
          })
        }
        setLoading('isLoadingCalendar', false)
      }).catch(err => {
        console.error('Failed to load calendar:', err)
        setLoading('isLoadingCalendar', false)
      })
    }

    loadData()
  }, [setStandings, setRace, setCalendar, setLoading])

  return (
    <div className={`app theme-${teamTheme}`}>
      <Layout />
    </div>
  )
}

export default App
