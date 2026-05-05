import { useEffect } from 'react'
import Layout from './layout/Layout'
import useStore, { getTeamTheme } from './store/useStore'
import { getStandings, getNextRace, getCalendar } from './services/f1Service'

function App() {
  const teamTheme = useStore(getTeamTheme)
  const setStandings = useStore(state => state.setStandings)
  const setRace = useStore(state => state.setRace)
  const setCalendar = useStore(state => state.setCalendar)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', teamTheme)
  }, [teamTheme])

  useEffect(() => {
    const loadData = async () => {
      try {
        const standings = await getStandings()
        if (standings && standings.drivers && standings.drivers.length > 0) {
          setStandings(standings)
        }

        const nextRace = await getNextRace()
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

        const calendar = await getCalendar()
        if (calendar && calendar.length > 0) {
          const currentCal = useStore.getState().calendar
          setCalendar({
            ...currentCal,
            rounds: calendar
          })
        }
      } catch (err) {
        console.error('Failed to load initial data:', err)
      }
    }

    loadData()
  }, [setStandings, setRace, setCalendar])

  return (
    <div className={`app theme-${teamTheme}`}>
      <Layout />
    </div>
  )
}

export default App
