import { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import NewsFeed from './components/NewsFeed'
import DriversStandings from './components/DriversStandings'
import ConstructorsStandings from './components/ConstructorsStandings'
import RaceHero from './components/RaceHero'
import CalendarStrip from './components/CalendarStrip'
import Podium from './components/Podium'
import Ticker from './components/Ticker'
import StatsRibbon from './components/StatsRibbon'
import Footer from './components/Footer'
import SettingsPanel from './components/SettingsPanel'
import AuthPage from './pages/AuthPage'
import OnboardingModal from './components/OnboardingModal'
import useStore from './store/useStore'
import { getStandings, getNextRace, getCalendar, getLatestResults, getRaceStats } from './services/f1Service'
import { getF1News } from './services/newsService'
import { getSeasonSessions } from './services/sessionService'
import { onAuthChange } from './services/authService'
import { saveUserToFirestore, getUserPreferences, updateUserPreferences } from './services/userService'

function App() {
  const activeTeam = useStore((state) => state.preferences?.team || 'ferrari')
  const defaultWidgets = { news: true, standings: true, podium: true, stats: true, calendar: true }
  const widgets = { ...defaultWidgets, ...(useStore((state) => state.preferences?.widgets) || {}) }
  const authReady = useStore((state) => state.authReady)
  const user = useStore((state) => state.user)
  const isAuthenticated = !!user

  const setUser = useStore(state => state.setUser)
  const setAuthReady = useStore(state => state.setAuthReady)
  const setPreferences = useStore(state => state.setPreferences)
  const setSessions = useStore(state => state.setSessions)
  const setStandings = useStore(state => state.setStandings)
  const setRace = useStore(state => state.setRace)
  const setCalendar = useStore(state => state.setCalendar)
  const setPodium = useStore(state => state.setPodium)
  const setNews = useStore(state => state.setNews)
  const setHeroStats = useStore(state => state.setHeroStats)
  const setTicker = useStore(state => state.setTicker)
  const setStats = useStore(state => state.setStats)
  const setRaceStats = useStore(state => state.setRaceStats)
  const setLoading = useStore(state => state.setLoading)
  const setError = useStore(state => state.setError)

  const standings = useStore(state => state.standings)
  const calendar = useStore(state => state.calendar)
  const podium = useStore(state => state.podium)
  const race = useStore(state => state.race)
  const raceStats = useStore(state => state.raceStats)

  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const preferences = useStore(state => state.preferences)
  const debounceTimer = useRef(null)
  const isInitialMount = useRef(true)

  // ── Network Awareness ────────────────────────────────
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // ── Auth initialization ──────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // 1. Fetch preferences first
        try {
          const prefs = await getUserPreferences(firebaseUser.uid)
          if (prefs) setPreferences(prefs)
        } catch (err) {
          console.error('Error fetching preferences:', err)
        }

        // 2. Set user
        const hour = new Date().getHours()
        const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
        const date = new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }).toUpperCase().replace(/,/g, ' ·')

        setUser({
          ...firebaseUser,
          name: firebaseUser.name?.split(' ')[0] || 'Driver',
          greeting: `${greeting}, ${firebaseUser.name?.split(' ')[0] || 'Driver'}`,
          date
        })
      } else {
        setUser(null)
      }
      setAuthReady(true)
    })
    return () => unsubscribe()
  }, [setUser, setAuthReady, setPreferences])

  // ── Auto-Sync Preferences to Firestore ───────────────
  useEffect(() => {
    // Skip the very first run to avoid overwriting DB with defaults on load
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    if (!isAuthenticated || !user?.uid || !isOnline) return

    // Clear previous timer
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    // Set new timer
    debounceTimer.current = setTimeout(() => {
      updateUserPreferences(user.uid, preferences)
    }, 1500) // Slightly longer debounce for production stability

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [preferences, isAuthenticated, user?.uid, isOnline])

  // ── Data Hydration ───────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated || !isOnline) return

    const fetchData = async () => {
      setLoading('isLoadingStandings', true)
      getStandings().then(data => setStandings(data)).catch(err => setError('errorStandings', err.message)).finally(() => setLoading('isLoadingStandings', false))

      setLoading('isLoadingRace', true)
      getNextRace().then(data => setRace(data)).catch(err => setError('errorRace', err.message)).finally(() => setLoading('isLoadingRace', false))

      setLoading('isLoadingCalendar', true)
      getCalendar().then(data => setCalendar(data)).catch(err => setError('errorCalendar', err.message)).finally(() => setLoading('isLoadingCalendar', false))

      setLoading('isLoadingResults', true)
      getLatestResults().then(data => setPodium(data)).catch(err => setError('errorResults', err.message)).finally(() => setLoading('isLoadingResults', false))

      setLoading('isLoadingStats', true)
      getRaceStats().then(data => setRaceStats(data)).catch(err => setError('errorStats', err.message)).finally(() => setLoading('isLoadingStats', false))

      setLoading('isLoadingNews', true)
      getF1News(activeTeam).then(data => setNews(data)).catch(err => setError('errorNews', err.message)).finally(() => setLoading('isLoadingNews', false))

      setLoading('isLoadingSessions', true)
      getSeasonSessions(2024).then(data => setSessions(data)).catch(err => console.error('Failed to fetch sessions:', err)).finally(() => setLoading('isLoadingSessions', false))
    }

    fetchData()
    const pollInterval = setInterval(fetchData, 600000) // 10 min polling for all data in production

    return () => clearInterval(pollInterval)
  }, [isAuthenticated, activeTeam, isOnline, setLoading, setStandings, setRace, setCalendar, setPodium, setRaceStats, setNews, setError, setSessions])

  // ── Stats derivation ────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return

    if (standings.drivers.length > 0 && calendar?.rounds?.length > 0) {
      setHeroStats([
        { val: standings.drivers[0].name, lbl: "World Driver's Championship Leader" },
        { val: standings.constructors[0].name, lbl: "World Constructor's Championship Leader" },
        { val: String(calendar.rounds.length), lbl: "Rounds" }
      ])
    }

    if (standings.drivers.length > 0 && standings.constructors.length > 0 && race.nextRace && podium.winner && raceStats) {
      const topDriver = standings.drivers[0]
      const topConstructor = standings.constructors[0]
      const nextRace = race.nextRace
      const winner = podium.winner

      setTicker([
        { sym: 'WDC', val: topDriver.name.toUpperCase(), pts: `${topDriver.points} pts` },
        { sym: 'WCC', val: topConstructor.name.toUpperCase(), pts: `${topConstructor.points} pts` },
        { sym: 'NEXT', val: nextRace.title.replace('Grand Prix', 'GP').toUpperCase(), pts: `${nextRace.dates.split(' ')[0]} ${nextRace.dates.split(' – ').pop()}`.toUpperCase() },
        { sym: 'WINNER', val: winner.Driver.familyName.toUpperCase(), pts: raceStats.latestRaceName.toUpperCase() },
        { sym: 'FL', val: raceStats.fastestLap?.driver.toUpperCase() || '--', pts: raceStats.fastestLap?.time || '--' },
        { sym: 'P2', val: standings.drivers[1]?.name.toUpperCase() || '--', pts: `${standings.drivers[1]?.points || 0} pts` },
        { sym: 'P3', val: standings.drivers[2]?.name.toUpperCase() || '--', pts: `${standings.drivers[2]?.points || 0} pts` },
        { sym: 'P4', val: standings.drivers[3]?.name.toUpperCase() || '--', pts: `${standings.drivers[3]?.points || 0} pts` }
      ])
    }

    if (standings.drivers.length > 1 && raceStats && podium.winner) {
      const p1 = standings.drivers[0]
      const p2 = standings.drivers[1]
      const gap = parseFloat(p1.points) - parseFloat(p2.points)

      setStats([
        { id: 1, label: "Championship Lead", bigHtml: `<em>+${gap}</em> pts`, sub: `${p1.name.split(' ').pop()} over ${p2.name.split(' ').pop()}` },
        { id: 2, label: `Fastest Lap 2026`, bigHtml: raceStats.fastestLap?.time || '--', sub: `${raceStats.fastestLap?.driver || '--'} · ${raceStats.latestRaceName}` },
        { id: 3, label: "Recent Winner", bigHtml: podium.winner.Driver.familyName, sub: `${podium.winner.Constructor.name} · ${raceStats.latestRaceName}` },
        { id: 4, label: "Next Race", bigHtml: race.nextRace ? race.nextRace.title.replace('Grand Prix', 'GP') : '--', sub: race.nextRace ? `${race.nextRace.dates.split(' ')[0]} ${race.nextRace.dates.split(' – ').pop()}` : '--' }
      ])
    }
  }, [isAuthenticated, standings, calendar, podium, race, raceStats, setHeroStats, setTicker, setStats])

  // Handle theme persistence at root level
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${preferences.appearance || 'light'}`);
  }, [preferences.appearance]);

  // Handle theme persistence at root level
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${preferences.appearance || 'light'}`);
  }, [preferences.appearance]);

  if (!authReady) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center', border: '1px solid var(--paper-3)', background: '#fff' }}>
          <div className="auth-accent"></div>
          <div className="auth-eyebrow" style={{ justifyContent: 'center', marginBottom: '32px' }}>
            <span className="checker-flag"></span>
            <span style={{ color: 'var(--carbon)', letterSpacing: '0.2em' }}>AUTHENTICATING SYSTEMS</span>
          </div>
          <div style={{ padding: '40px 0' }}>
            <span className="auth-spinner" style={{ 
              borderTopColor: 'var(--racing)', 
              borderColor: 'var(--rule-light)', 
              width: '40px', 
              height: '40px', 
              display: 'inline-block',
              borderWidth: '3px'
            }}></span>
          </div>
          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'var(--ink-3)', opacity: 0.6, marginTop: '24px' }}>
            PIT WALL SECURE HANDSHAKE IN PROGRESS...
          </p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <div 
      className="pit-wall-app" 
      data-team={preferences.team}
    >
      <Ticker />
      
      <main className="main-content">
        <Hero />
        {widgets.stats && <StatsRibbon />}
        <RaceHero />
        
        <div className="dashboard-grid-container">
          {(widgets.podium || widgets.standings || widgets.news) && (
            <div className={`dashboard-grid ${!widgets.news ? 'no-news' : ''}`}>
              <div className="grid-left">
                {widgets.podium && <Podium />}
                {widgets.standings && (
                  <div className="standings-row">
                    <DriversStandings />
                    <ConstructorsStandings />
                  </div>
                )}
              </div>
              {widgets.news && (
                <div className="grid-right">
                  <NewsFeed />
                </div>
              )}
            </div>
          )}
        </div>

        {widgets.calendar && <CalendarStrip />}
      </main>

      <Footer />
      <SettingsPanel />
      <OnboardingModal />

      {!isOnline && (
        <div className="offline-banner">
          <div className="offline-dot"></div>
          OFFLINE · LIMITED FUNCTIONALITY
        </div>
      )}
    </div>
  )
}

export default App
