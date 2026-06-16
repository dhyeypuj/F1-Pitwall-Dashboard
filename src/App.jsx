import { useEffect, useRef, useState } from 'react'
import Hero from './components/Hero'
import NewsFeed from './components/NewsFeed'
import LiveFeedPage from './pages/LiveFeedPage'
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
import { getActiveSeason } from './services/seasonService'
import * as Sentry from '@sentry/react'
import { logger } from './services/logger'

function App() {
  const activeSeason = useStore((state) => state.activeSeason)
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
  
  const currentPage = useStore(state => state.currentPage)
  const setCurrentPage = useStore(state => state.setCurrentPage)
  const commentaryTab = useStore(state => state.commentaryTab)
  const setCommentaryTab = useStore(state => state.setCommentaryTab)
  const fetchCommentaryFeed = useStore(state => state.fetchCommentaryFeed)
  const commentaryMode = useStore(state => state.commentaryMode)
  const showAlert = useStore(state => state.showAlert)
  const setShowAlert = useStore(state => state.setShowAlert)

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
          logger.error('Error fetching preferences:', err)
        }

        // 2. Set user
        const hour = new Date().getHours()
        const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
        const date = new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }).toUpperCase().replace(/,/g, ' ·')

        const rawName = firebaseUser.name?.split(' ')[0] || 'Driver'
        const capitalizedName = rawName.charAt(0).toUpperCase() + rawName.slice(1)

        setUser({
          ...firebaseUser,
          name: capitalizedName,
          greeting: `${greeting}, ${capitalizedName}`,
          date
        })

        // Set Sentry User Context for production debugging
        Sentry.setUser({
          id: firebaseUser.uid,
          username: capitalizedName,
          email: firebaseUser.email || ''
        })

        logger.info(`User authenticated successfully: ${firebaseUser.uid}`)
      } else {
        setUser(null)
        Sentry.setUser(null)
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
      try {
        const season = await getActiveSeason()
        useStore.getState().setActiveSeason(season)

        setLoading('isLoadingStandings', true)
        getStandings()
          .then(data => setStandings(data))
          .catch(err => {
            setError('errorStandings', err.message)
            logger.error('Failed to fetch standings from Jolpi API', err)
          })
          .finally(() => setLoading('isLoadingStandings', false))

        setLoading('isLoadingRace', true)
        getNextRace()
          .then(data => setRace(data))
          .catch(err => {
            setError('errorRace', err.message)
            logger.error('Failed to fetch next race schedule', err)
          })
          .finally(() => setLoading('isLoadingRace', false))

        setLoading('isLoadingCalendar', true)
        getCalendar()
          .then(data => setCalendar(data))
          .catch(err => {
            setError('errorCalendar', err.message)
            logger.error('Failed to fetch 2026 race calendar', err)
          })
          .finally(() => setLoading('isLoadingCalendar', false))

        setLoading('isLoadingResults', true)
        getLatestResults()
          .then(data => setPodium(data))
          .catch(err => {
            setError('errorResults', err.message)
            logger.error('Failed to fetch latest race results', err)
          })
          .finally(() => setLoading('isLoadingResults', false))

        setLoading('isLoadingStats', true)
        getRaceStats()
          .then(data => setRaceStats(data))
          .catch(err => {
            setError('errorStats', err.message)
            logger.error('Failed to fetch season race statistics', err)
          })
          .finally(() => setLoading('isLoadingStats', false))

        setLoading('isLoadingNews', true)
        getF1News(activeTeam)
          .then(data => setNews(data))
          .catch(err => {
            setError('errorNews', err.message)
            logger.error('Failed to fetch F1 news feeds from proxy', err)
          })
          .finally(() => setLoading('isLoadingNews', false))

        setLoading('isLoadingSessions', true)
        getSeasonSessions(season)
          .then(data => setSessions(data))
          .catch(err => {
            logger.error('Failed to fetch telemetry/timing session metadata from OpenF1', err)
          })
          .finally(() => setLoading('isLoadingSessions', false))
      } catch (err) {
        logger.error('Critical failure during data hydration', err)
      }
    }

    fetchData()
    const pollInterval = setInterval(fetchData, 600000) // 10 min polling for all data in production

    return () => clearInterval(pollInterval)
  }, [isAuthenticated, activeTeam, isOnline, setLoading, setStandings, setRace, setCalendar, setPodium, setRaceStats, setNews, setError, setSessions, activeSeason])

  // ── Live Telemetry/Commentary Fast Polling ─────────────────
  useEffect(() => {
    if (!isAuthenticated || !isOnline) return

    // Initial load
    fetchCommentaryFeed()

    // Setup polling: 20 seconds for active live, 5 minutes for demo
    const intervalTime = commentaryMode === 'live' ? 20000 : 300000
    const pollInterval = setInterval(() => {
      fetchCommentaryFeed()
    }, intervalTime)

    return () => clearInterval(pollInterval)
  }, [isAuthenticated, isOnline, fetchCommentaryFeed, commentaryMode])

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

    if (standings.drivers.length > 0 && standings.constructors.length > 0 && race.nextRace) {
      const topDriver = standings.drivers[0]
      const topConstructor = standings.constructors[0]
      const nextRace = race.nextRace
      const winner = podium?.winner
      const latestStats = raceStats

      const tickerItems = [
        { sym: 'WDC', val: topDriver.name.toUpperCase(), pts: `${topDriver.points} pts` },
        { sym: 'WCC', val: topConstructor.name.toUpperCase(), pts: `${topConstructor.points} pts` },
        { sym: 'NEXT', val: nextRace.title.replace('Grand Prix', 'GP').toUpperCase(), pts: (nextRace.dates || '').toUpperCase() },
      ]

      if (winner && latestStats) {
        tickerItems.push(
          { sym: 'WINNER', val: (winner.Driver?.familyName || '').toUpperCase(), pts: latestStats.latestRaceName.toUpperCase() }
        )
      }
      if (latestStats?.fastestLap) {
        tickerItems.push(
          { sym: 'FL', val: latestStats.fastestLap.driver.toUpperCase(), pts: latestStats.fastestLap.time }
        )
      }

      // Add other standings positions if available
      for (let idx = 1; idx <= 4; idx++) {
        const driver = standings.drivers[idx]
        if (driver) {
          tickerItems.push({
            sym: `P${idx + 1}`,
            val: driver.name.toUpperCase(),
            pts: `${driver.points} pts`
          })
        }
      }

      setTicker(tickerItems)
    }

    if (standings.drivers.length > 1) {
      const p1 = standings.drivers[0]
      const p2 = standings.drivers[1]
      const gap = parseFloat(p1.points || 0) - parseFloat(p2.points || 0)

      const items = [
        { id: 1, label: "Drivers' Championship Lead", bigHtml: `<em>+${gap}</em> pts`, sub: `${p1.name.split(' ').pop()} over ${p2.name.split(' ').pop()}` }
      ]

      if (standings.constructors && standings.constructors.length > 1) {
        const c1 = standings.constructors[0]
        const c2 = standings.constructors[1]
        const cGap = parseFloat(c1.points || 0) - parseFloat(c2.points || 0)
        items.push({
          id: 2,
          label: "Constructors' Championship Lead",
          bigHtml: `<em>+${cGap}</em> pts`,
          sub: `${c1.name} over ${c2.name}`
        })
      } else {
        items.push({
          id: 2,
          label: "Constructors' Championship Lead",
          bigHtml: '--',
          sub: 'No data yet'
        })
      }

      if (podium?.winner && raceStats) {
        items.push({
          id: 3,
          label: "Recent Winner",
          bigHtml: podium.winner.Driver?.familyName || 'TBD',
          sub: `${podium.winner.Constructor?.name || ''} · ${raceStats.latestRaceName}`
        })
      } else {
        items.push({
          id: 3,
          label: "Recent Winner",
          bigHtml: 'TBD',
          sub: 'No races completed'
        })
      }

      if (race.nextRace) {
        items.push({
          id: 4,
          label: "Next Race",
          bigHtml: race.nextRace.title.replace('Grand Prix', 'GP'),
          sub: race.nextRace.dates || '--'
        })
      } else {
        items.push({
          id: 4,
          label: "Next Race",
          bigHtml: '--',
          sub: '--'
        })
      }

      setStats(items)
    }
  }, [isAuthenticated, standings, calendar, podium, race, raceStats, setHeroStats, setTicker, setStats, activeSeason])

  const appearance = useStore(state => state.preferences?.appearance)

  // Handle theme persistence at root level, resolving system settings dynamically
  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = () => {
      root.classList.remove('theme-light', 'theme-dark');
      let activeAppearance = appearance || 'system';
      if (activeAppearance === 'system') {
        const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        activeAppearance = systemIsDark ? 'dark' : 'light';
      }
      root.classList.add(`theme-${activeAppearance}`);
    };

    applyTheme();

    if (appearance === 'system' || !appearance) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = () => applyTheme();
      
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', listener);
        return () => mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.addListener(listener);
        return () => mediaQuery.removeListener(listener);
      }
    }
  }, [appearance]);

  if (!authReady) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center', border: '1px solid var(--paper-3)' }}>
          <div className="auth-accent"></div>
          <div className="auth-eyebrow" style={{ justifyContent: 'center', marginBottom: '32px' }}>
            <span className="checker-flag"></span>
            <span style={{ color: 'var(--ink)', letterSpacing: '0.2em' }}>AUTHENTICATING SYSTEMS</span>
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

  if (currentPage === 'live-feed') {
    return (
      <div 
        className={`pit-wall-app team-${preferences.team}`} 
        data-team={preferences.team}
      >
        <LiveFeedPage />
      </div>
    )
  }

  return (
    <div 
      className={`pit-wall-app team-${preferences.team}`} 
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

      {showAlert && (
        <div className="custom-alert-overlay" onClick={() => setShowAlert(false)}>
          <div className="custom-alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="custom-alert-header">
              <span className="custom-alert-icon">⚠️</span>
              <h3>NO ACTIVE SESSION</h3>
            </div>
            <div className="custom-alert-body">
              <p>There is no Formula 1 session currently live.</p>
              <p className="custom-alert-sub">You can still proceed to view the Pit Wall layout, which will automatically go live as soon as the next session starts.</p>
            </div>
            <div className="custom-alert-footer">
              <button 
                type="button" 
                className="alert-btn-cancel"
                onClick={() => setShowAlert(false)}
              >
                STAY ON DASHBOARD
              </button>
              <button 
                type="button" 
                className="alert-btn-confirm"
                onClick={() => {
                  setShowAlert(false)
                  setCurrentPage('live-feed')
                  setCommentaryTab('live')
                }}
              >
                PROCEED TO PIT WALL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
