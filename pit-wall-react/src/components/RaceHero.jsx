import useStore, { getNextRaceName } from '../store/useStore'
import { useCountdown } from '../hooks/useCountdown'
import { formatNumber } from '../utils/format'

const RaceHero = () => {
  const { nextRace } = useStore((state) => state.race)
  const sessions = useStore((state) => state.sessions)
  const isLoading = useStore((state) => state.isLoadingRace)
  const error = useStore((state) => state.errorRace)

  // Find dynamic session data for this round
  const currentRoundSessions = sessions.find(s => s.round === nextRace?.roundNumber)?.sessions || {}
  
  const now = new Date()
  const upcomingSessions = Object.entries(currentRoundSessions)
    .map(([key, data]) => ({ key, ...data }))
    .filter(s => new Date(s.start) > now)
    .sort((a, b) => new Date(a.start) - new Date(b.start))

  const activeSession = upcomingSessions[0] || null
  const targetDate = activeSession ? activeSession.start : nextRace?.date
  
  const { days, hours, minutes, seconds } = useCountdown(targetDate)

  if (isLoading) {
    return (
      <section className="race-hero">
        <div className="race-block" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', opacity: 0.5 }}>
            <div style={{ background: '#333', width: '80px', height: '16px', borderRadius: '4px' }}></div>
            <div style={{ background: '#333', width: '250px', height: '40px', borderRadius: '4px' }}></div>
            <div style={{ background: '#222', width: '150px', height: '16px', borderRadius: '4px' }}></div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !nextRace) {
    return (
      <section className="race-hero">
        <div className="race-block" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 className="race-name" style={{ color: error ? 'var(--ferrari)' : '#666' }}>{error || 'Next Race Unavailable'}</h2>
        </div>
      </section>
    )
  }

  const formatLocalTime = (isoStr) => {
    if (!isoStr) return ''
    return new Intl.DateTimeFormat(navigator.language, {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(new Date(isoStr))
  }

  const isSprintWeekend = !!currentRoundSessions.sprint

  return (
    <section className="race-hero">
      <div className="race-block">
        <div className="race-grid">
          <div className="race-left">
            <div className="race-meta-row">
              <span className="race-round">◆ {nextRace.round.toUpperCase()} · {nextRace.status.toUpperCase()}</span>
              {isSprintWeekend && <span className="race-round" style={{ background: 'var(--mclaren)', color: '#000', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>SPRINT WEEKEND</span>}
              <span className="race-flag-big" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 800, letterSpacing: '-1px', color: '#fff', fontSize: '28px' }}>{nextRace.countryCode}</span>
            </div>
            
            <h2 className="race-name">
              {nextRace.title.replace('Grand Prix', '')}
              <em style={{ color: 'var(--ferrari)', fontStyle: 'italic' }}>Grand Prix</em>
            </h2>

            <div className="race-circuit">
              <strong>{nextRace.circuit}</strong> 
              {nextRace.venue ? ` · ${nextRace.venue}` : ` · ${nextRace.location}`}
            </div>
            
            <div className="race-circuit" style={{ opacity: 0.9, fontSize: '1rem', marginTop: '8px', color: '#fff' }}>
              Round {nextRace.roundNumber} of 22 · {nextRace.laps} laps · {nextRace.distance} km
            </div>

            <div className="race-stats" style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
              <div className="race-stat">
                <div className="race-stat-label">{activeSession ? activeSession.name : 'Race Day'}</div>
                <div className="race-stat-val" style={{ color: 'var(--ferrari)' }}>{activeSession ? formatLocalTime(activeSession.start) : nextRace.dates}</div>
              </div>
              <div className="race-stat">
                <div className="race-stat-label">Lap Record</div>
                <div className="race-stat-val">{nextRace.lapRecord}</div>
              </div>
              <div className="race-stat">
                <div className="race-stat-label">Prev. Pole</div>
                <div className="race-stat-val">{nextRace.previousPole}</div>
              </div>
            </div>
          </div>

          <div className="race-right">
            <div className="countdown-label">{activeSession ? `${activeSession.name.toUpperCase()} STARTS IN` : 'LIGHTS OUT IN'}</div>
            <div className="countdown">
              <div className="cd-cell"><div className="cd-num" id="cd-d">{formatNumber(days)}</div><div className="cd-label">Days</div></div>
              <div className="cd-cell"><div className="cd-num" id="cd-h">{formatNumber(hours)}</div><div className="cd-label">Hours</div></div>
              <div className="cd-cell"><div className="cd-num" id="cd-m">{formatNumber(minutes)}</div><div className="cd-label">Mins</div></div>
              <div className="cd-cell"><div className="cd-num" id="cd-s">{formatNumber(seconds)}</div><div className="cd-label">Secs</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RaceHero
