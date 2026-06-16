import { useEffect, useState } from 'react'
import useStore from '../store/useStore'
import LiveCommentary from '../components/LiveCommentary'

function LiveFeedPage() {
  const setCurrentPage = useStore((state) => state.setCurrentPage)
  const { nextRace } = useStore((state) => state.race)
  const standings = useStore((state) => state.standings)
  const sessions = useStore((state) => state.sessions)
  const calendar = useStore((state) => state.calendar)
  const commentaryMode = useStore((state) => state.commentaryMode)
  const liveCommentary = useStore((state) => state.liveCommentary)

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Track conditions (static defaults, no simulation or fluctuations)
  const trackTemp = '38.0'
  const airTemp = '24.0'
  const humidity = '45'
  const windSpeed = '12.0'
  
  // Driver list for telemetry (static table, no live updates simulated)
  const [drivers, setDrivers] = useState([])

  // Initialize drivers from WDC standings or fall back to default grid
  useEffect(() => {
    let list = []
    if (standings?.drivers && standings.drivers.length > 0) {
      list = standings.drivers.map((d, index) => ({
        pos: index + 1,
        no: d.number || '--',
        name: d.name,
        team: d.constructorName || 'Ferrari',
        gap: index === 0 ? 'INTERVAL' : `+${(index * 1.45).toFixed(3)}s`,
        speed: '--',
        gear: '--',
        drs: false,
        lap: '--'
      }))
    } else {
      // Fallback grid - Full 22 drivers aligned with current 2026 teams
      const fallback = [
        { name: 'A. ANTONELLI', team: 'Mercedes', no: '12' },
        { name: 'L. HAMILTON', team: 'Ferrari', no: '44' },
        { name: 'G. RUSSELL', team: 'Mercedes', no: '63' },
        { name: 'C. LECLERC', team: 'Ferrari', no: '16' },
        { name: 'L. NORRIS', team: 'McLaren', no: '1' },
        { name: 'O. PIASTRI', team: 'McLaren', no: '81' },
        { name: 'M. VERSTAPPEN', team: 'Red Bull Racing', no: '3' },
        { name: 'P. GASLY', team: 'Alpine', no: '10' },
        { name: 'I. HADJAR', team: 'Red Bull Racing', no: '6' },
        { name: 'L. LAWSON', team: 'Racing Bulls', no: '30' },
        { name: 'O. BEARMAN', team: 'Haas', no: '87' },
        { name: 'F. COLAPINTO', team: 'Alpine', no: '43' },
        { name: 'A. LINDBLAD', team: 'Racing Bulls', no: '41' },
        { name: 'C. SAINZ', team: 'Williams', no: '55' },
        { name: 'A. ALBON', team: 'Williams', no: '23' },
        { name: 'E. OCON', team: 'Haas', no: '31' },
        { name: 'G. BORTOLETO', team: 'Audi', no: '5' },
        { name: 'F. ALONSO', team: 'Aston Martin', no: '14' },
        { name: 'N. HULKENBERG', team: 'Audi', no: '27' },
        { name: 'V. BOTTAS', team: 'Cadillac', no: '77' },
        { name: 'S. PEREZ', team: 'Cadillac', no: '11' },
        { name: 'L. STROLL', team: 'Aston Martin', no: '18' }
      ]
      list = fallback.map((d, index) => ({
        pos: index + 1,
        no: d.no,
        name: d.name,
        team: d.team,
        gap: index === 0 ? 'INTERVAL' : `+${(index * 1.25).toFixed(3)}s`,
        speed: '--',
        gear: '--',
        drs: false,
        lap: '--'
      }))
    }
    setDrivers(list) // Set all drivers
  }, [standings])

  // Find active flag status from the commentary or track state
  const getActiveFlag = () => {
    if (liveCommentary && liveCommentary.length > 0) {
      const latest = liveCommentary[0] // Latest message
      const text = (latest.message || '').toUpperCase()
      if (text.includes('RED FLAG')) return 'RED FLAG'
      if (text.includes('SAFETY CAR') && !text.includes('VIRTUAL') && !text.includes('IN THIS LAP') && !text.includes('CLEAR')) return 'SAFETY CAR'
      if (text.includes('VIRTUAL SAFETY CAR')) return 'VSC ACTIVE'
    }
    return 'GREEN FLAG'
  }

  const activeFlag = getActiveFlag()
  const flagClass = activeFlag === 'RED FLAG' ? 'flag-red' : 
                    activeFlag === 'SAFETY CAR' ? 'flag-yellow' : 
                    activeFlag === 'VSC ACTIVE' ? 'flag-vsc' : 'flag-green'

  // Resolve active/upcoming session name for the header title
  const currentRoundSessions = sessions.find(s => s.round === nextRace?.roundNumber)?.sessions || {}
  const sessionList = Object.entries(currentRoundSessions)
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => new Date(a.start) - new Date(b.start))

  const scheduledLiveSession = sessionList.find(s => {
    const start = new Date(s.start)
    const end = new Date(s.end)
    return currentTime >= start && currentTime <= end
  })

  const upcomingSession = sessionList.filter(s => new Date(s.start) > currentTime)[0]
  const pastSessions = sessionList.filter(s => new Date(s.end) < currentTime)
  const isWeekendCompleted = pastSessions.length === sessionList.length && sessionList.length > 0

  let sessionName = ''
  let gpTitle = nextRace?.title || 'GRAND PRIX'
  let targetSessionDate = null
  let isSessionLive = false

  if (scheduledLiveSession) {
    sessionName = scheduledLiveSession.name
    targetSessionDate = new Date(scheduledLiveSession.end)
    isSessionLive = true
  } else if (upcomingSession) {
    sessionName = upcomingSession.name
    targetSessionDate = new Date(upcomingSession.start)
    isSessionLive = false
  } else if (isWeekendCompleted) {
    // If the entire weekend is completed, move on to the next session of the following round
    const nextRoundNumber = (nextRace?.roundNumber || 0) + 1
    const nextRoundSessions = sessions.find(s => s.round === nextRoundNumber)?.sessions || {}
    const nextSessionList = Object.entries(nextRoundSessions)
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => new Date(a.start) - new Date(b.start))

    if (nextSessionList.length > 0) {
      sessionName = nextSessionList[0].name
      targetSessionDate = new Date(nextSessionList[0].start)
      isSessionLive = false
      // Also update the GP title to the next round's name
      const nextRoundCalendar = calendar?.rounds?.find(r => parseInt(r.num, 10) === nextRoundNumber)
      if (nextRoundCalendar) {
        gpTitle = nextRoundCalendar.name
      }
    } else {
      // Fallback if no next round is available in schedule
      const lastSession = pastSessions[pastSessions.length - 1]
      if (lastSession) {
        sessionName = lastSession.name
        targetSessionDate = null
        isSessionLive = false
      }
    }
  }

  const getTimerText = () => {
    if (!targetSessionDate) return ''
    const diffMs = targetSessionDate - currentTime
    if (diffMs <= 0) return ''

    const totalSecs = Math.floor(diffMs / 1000)
    const secs = totalSecs % 60
    const totalMins = Math.floor(totalSecs / 60)
    const mins = totalMins % 60
    const totalHours = Math.floor(totalMins / 60)
    const hours = totalHours % 24
    const days = Math.floor(totalHours / 24)

    const pad = (num) => String(num).padStart(2, '0')

    if (isSessionLive) {
      // Session Clock: format as H:MM:SS or MM:SS
      if (totalHours > 0) {
        return `${pad(totalHours)}:${pad(mins)}:${pad(secs)}`
      } else {
        return `${pad(mins)}:${pad(secs)}`
      }
    } else {
      // Countdown to next session: format as Dd Hh Mm Ss
      let parts = []
      if (days > 0) parts.push(`${days}d`)
      if (hours > 0 || days > 0) parts.push(`${hours}h`)
      parts.push(`${mins}m`)
      parts.push(`${secs}s`)
      return `IN ${parts.join(' ')}`
    }
  }

  const timerText = getTimerText()

  return (
    <div className="live-feed-page">
      <header className="live-feed-header">
        <button 
          type="button" 
          id="btn-back-dashboard"
          className="back-btn"
          onClick={() => setCurrentPage('dashboard')}
        >
          ← BACK TO DASHBOARD
        </button>
        <div className="live-feed-title">
          <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <span>
              {gpTitle.toUpperCase()}
              {sessionName && ` - ${sessionName.toUpperCase()}`}
            </span>
            {timerText && (
              <span className={`header-session-timer ${isSessionLive ? 'timer-live' : 'timer-countdown'}`}>
                {timerText}
              </span>
            )}
          </h2>
          <span className="live-feed-sub">LIVE PIT WALL TELEMETRY & COMMENTARY</span>
        </div>
        <div className="live-feed-status">
          <span className={`status-indicator-dot ${commentaryMode === 'live' ? 'live' : 'offline'}`}></span>
          <span className="status-indicator-text">
            {commentaryMode === 'live' ? 'LIVE · SESSION ACTIVE' : 'OFFLINE · NO ACTIVE SESSION'}
          </span>
        </div>
      </header>

      <div className="live-feed-grid">
        {/* Left Column: Telemetry & Track Stats */}
        <section className={`live-telemetry-panel ${commentaryMode === 'demo' ? 'coming-soon' : ''}`}>
          {commentaryMode === 'demo' ? (
            <div className="telemetry-coming-soon-content">
              <span className="coming-soon-icon">📡</span>
              <h3>LIVE TELEMETRY</h3>
              <p>COMING SOON</p>
              <span className="coming-soon-subtext">Will activate automatically when the next session goes live.</span>
            </div>
          ) : (
            <>
              <div className="panel-header-row">
                <h3 className="panel-title">TELEMETRY MONITOR</h3>
                <div className={`track-flag-banner ${flagClass}`}>
                  {activeFlag}
                </div>
              </div>

              {/* Track Conditions */}
              <div className="track-conditions-grid">
                <div className="condition-cell">
                  <span className="condition-lbl">TRACK TEMP</span>
                  <span className="condition-val">{trackTemp}°C</span>
                </div>
                <div className="condition-cell">
                  <span className="condition-lbl">AIR TEMP</span>
                  <span className="condition-val">{airTemp}°C</span>
                </div>
                <div className="condition-cell">
                  <span className="condition-lbl">HUMIDITY</span>
                  <span className="condition-val">{humidity}%</span>
                </div>
                <div className="condition-cell">
                  <span className="condition-lbl">WIND SPEED</span>
                  <span className="condition-val">{windSpeed} km/h</span>
                </div>
              </div>

              {/* Telemetry Table */}
              <div className="telemetry-table-container">
                <table className="telemetry-table">
                  <thead>
                    <tr>
                      <th style={{ width: '50px', textAlign: 'center' }}>POS</th>
                      <th style={{ width: '50px', textAlign: 'center' }}>NO</th>
                      <th>DRIVER</th>
                      <th>TEAM</th>
                      <th style={{ width: '80px', textAlign: 'center' }}>LAP</th>
                      <th style={{ width: '110px', textAlign: 'right' }}>GAP</th>
                      <th style={{ width: '90px', textAlign: 'right' }}>SPEED</th>
                      <th style={{ width: '60px', textAlign: 'center' }}>GEAR</th>
                      <th style={{ width: '70px', textAlign: 'center' }}>DRS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drivers.map((d) => (
                      <tr key={d.pos} className={`driver-row team-${d.team.toLowerCase().replace(/\s+/g, '-')}`}>
                        <td className="cell-pos">{d.pos}</td>
                        <td className="cell-no">{d.no}</td>
                        <td className="cell-name"><strong>{d.name.toUpperCase()}</strong></td>
                        <td className="cell-team">{d.team}</td>
                        <td className="cell-lap">{d.lap}</td>
                        <td className="cell-gap">{d.gap}</td>
                        <td className="cell-speed">
                          {d.speed}
                          {d.speed !== '--' && <span className="unit"> KM/H</span>}
                        </td>
                        <td className="cell-gear">{d.gear}</td>
                        <td className="cell-drs">
                          <span className={`drs-pill ${d.drs ? 'active' : 'inactive'}`}>
                            DRS
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>

        {/* Right Column: Commentary Feed */}
        <section className="live-commentary-panel">
          <LiveCommentary />
        </section>
      </div>
    </div>
  )
}

export default LiveFeedPage
