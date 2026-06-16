import { useEffect, useState, useRef } from 'react'
import useStore, { getNextRaceName } from '../store/useStore'
import { useCountdown } from '../hooks/useCountdown'
import { formatNumber } from '../utils/format'
import { getLiveSessionControl } from '../services/f1Service'
import { isExtendableSession } from '../services/sessionService'

const RaceHero = () => {
  const { nextRace } = useStore((state) => state.race)
  const sessions = useStore((state) => state.sessions)
  const calendar = useStore((state) => state.calendar)
  const isLoading = useStore((state) => state.isLoadingRace)
  const error = useStore((state) => state.errorRace)
  
  const setCurrentPage = useStore((state) => state.setCurrentPage)
  const setCommentaryTab = useStore((state) => state.setCommentaryTab)
  const commentaryMode = useStore((state) => state.commentaryMode)
  const setShowAlert = useStore((state) => state.setShowAlert)

  const [liveStatus, setLiveStatus] = useState('none') // none, red_flag, safety_car, vsc, chequered_flag
  const pollingIntervalRef = useRef(null)

  // Find dynamic session data for this round
  const currentRoundSessions = sessions.find(s => s.round === nextRace?.roundNumber)?.sessions || {}
  
  const now = new Date()
  const sessionList = Object.entries(currentRoundSessions)
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => new Date(a.start) - new Date(b.start))

  // Find if there is a session currently live (now is between start and end)
  const scheduledLiveSession = sessionList.find(s => {
    const start = new Date(s.start)
    const end = new Date(s.end)
    return now >= start && now <= end
  })

  // Detect a potentially extended session (started but within 3 hours, and not finished)
  // Only the main Race session qualifies — practices/qualifying have fixed durations
  const potentialExtendedSession = sessionList.find(s => {
    if (!isExtendableSession(s.key, s.name)) return false
    const start = new Date(s.start)
    const end = new Date(s.end)
    const hoursSinceStart = (now - start) / 3600000
    return now > end && hoursSinceStart >= 0 && hoursSinceStart <= 3
  })

  let activeSession = null
  let isLive = false
  let targetDate = null

  if (scheduledLiveSession) {
    activeSession = scheduledLiveSession
    isLive = true
    targetDate = scheduledLiveSession.end
  } else if (potentialExtendedSession && liveStatus !== 'chequered_flag') {
    activeSession = potentialExtendedSession
    isLive = true
    targetDate = potentialExtendedSession.end
  } else {
    // Find the next upcoming session
    const upcoming = sessionList.filter(s => new Date(s.start) > now)
    if (upcoming.length > 0) {
      activeSession = upcoming[0]
      isLive = false
      targetDate = activeSession.start
    } else {
      activeSession = null
      isLive = false
      targetDate = nextRace?.date
    }
  }

  // If chequered flag is shown, force end live status and transition to next session
  const isFinished = liveStatus === 'chequered_flag'
  if (isLive && isFinished) {
    isLive = false
    const upcoming = sessionList.filter(s => new Date(s.start) > now)
    if (upcoming.length > 0) {
      activeSession = upcoming[0]
      targetDate = activeSession.start
    } else {
      activeSession = null
      targetDate = nextRace?.date
    }
  }

  // Set up polling for live session control status
  useEffect(() => {
    const shouldPoll = activeSession && isLive && nextRace
    
    if (!shouldPoll) {
      setLiveStatus('none')
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
      return
    }

    const locationName = nextRace.city || nextRace.location.split(',')[0]
    
    const checkLiveStatus = async () => {
      const control = await getLiveSessionControl(locationName, activeSession.name)
      if (control) {
        setLiveStatus(control.status)
      }
    }

    checkLiveStatus()
    pollingIntervalRef.current = setInterval(checkLiveStatus, 15000)

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
        pollingIntervalRef.current = null
      }
    }
  }, [activeSession?.name, isLive, nextRace])

  const { days, hours, minutes, seconds } = useCountdown(targetDate)

  if (isLoading) {
    return (
      <section className="race-hero skeleton-hero">
        <div className="race-block">
          <div className="race-grid">
            <div className="race-left">
              <div className="race-meta-row">
                <span className="skeleton-box" style={{ width: '120px', height: '16px', borderRadius: '4px', display: 'inline-block' }}></span>
              </div>
              
              <h2 className="race-name" style={{ marginTop: '12px' }}>
                <span className="skeleton-box" style={{ width: '280px', height: '40px', borderRadius: '4px', display: 'inline-block' }}></span>
              </h2>

              <div className="race-circuit" style={{ marginTop: '12px' }}>
                <span className="skeleton-box" style={{ width: '220px', height: '16px', borderRadius: '4px', display: 'inline-block' }}></span>
              </div>
              
              <div className="race-circuit" style={{ marginTop: '8px' }}>
                <span className="skeleton-box" style={{ width: '160px', height: '14px', borderRadius: '4px', display: 'inline-block' }}></span>
              </div>

              <div className="race-stats" style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
                <div className="race-stat">
                  <div className="race-stat-label"><span className="skeleton-box" style={{ width: '60px', height: '10px', borderRadius: '2px', display: 'inline-block' }}></span></div>
                  <div className="race-stat-val" style={{ marginTop: '8px' }}><span className="skeleton-box" style={{ width: '100px', height: '16px', borderRadius: '4px', display: 'inline-block' }}></span></div>
                </div>
                <div className="race-stat">
                  <div className="race-stat-label"><span className="skeleton-box" style={{ width: '60px', height: '10px', borderRadius: '2px', display: 'inline-block' }}></span></div>
                  <div className="race-stat-val" style={{ marginTop: '8px' }}><span className="skeleton-box" style={{ width: '100px', height: '16px', borderRadius: '4px', display: 'inline-block' }}></span></div>
                </div>
                <div className="race-stat">
                  <div className="race-stat-label"><span className="skeleton-box" style={{ width: '60px', height: '10px', borderRadius: '2px', display: 'inline-block' }}></span></div>
                  <div className="race-stat-val" style={{ marginTop: '8px' }}><span className="skeleton-box" style={{ width: '100px', height: '16px', borderRadius: '4px', display: 'inline-block' }}></span></div>
                </div>
              </div>
            </div>

            <div className="race-right">
              <div className="countdown-label">
                <span className="skeleton-box" style={{ width: '110px', height: '12px', borderRadius: '2px', display: 'inline-block' }}></span>
              </div>
              <div className="countdown" style={{ marginTop: '16px' }}>
                <div className="cd-cell">
                  <div className="cd-num skeleton-box" style={{ width: '64px', height: '64px', borderRadius: '8px' }}></div>
                  <div className="cd-label" style={{ marginTop: '8px', background: 'transparent' }}><span className="skeleton-box" style={{ width: '36px', height: '10px', borderRadius: '2px', display: 'inline-block' }}></span></div>
                </div>
                <div className="cd-cell">
                  <div className="cd-num skeleton-box" style={{ width: '64px', height: '64px', borderRadius: '8px' }}></div>
                  <div className="cd-label" style={{ marginTop: '8px', background: 'transparent' }}><span className="skeleton-box" style={{ width: '36px', height: '10px', borderRadius: '2px', display: 'inline-block' }}></span></div>
                </div>
                <div className="cd-cell">
                  <div className="cd-num skeleton-box" style={{ width: '64px', height: '64px', borderRadius: '8px' }}></div>
                  <div className="cd-label" style={{ marginTop: '8px', background: 'transparent' }}><span className="skeleton-box" style={{ width: '36px', height: '10px', borderRadius: '2px', display: 'inline-block' }}></span></div>
                </div>
                <div className="cd-cell">
                  <div className="cd-num skeleton-box" style={{ width: '64px', height: '64px', borderRadius: '8px' }}></div>
                  <div className="cd-label" style={{ marginTop: '8px', background: 'transparent' }}><span className="skeleton-box" style={{ width: '36px', height: '10px', borderRadius: '2px', display: 'inline-block' }}></span></div>
                </div>
              </div>

              <div className="countdown-tabs" style={{ marginTop: '24px' }}>
                <span className="skeleton-box" style={{ width: '100%', height: '44px', borderRadius: '4px', display: 'inline-block' }}></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (error || !nextRace) {
    return (
      <section className="race-hero">
        <div className="race-block" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 className="race-name" style={{ color: error ? 'var(--racing)' : '#666' }}>{error || 'Next Race Unavailable'}</h2>
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
              {isSprintWeekend && <span className="race-round" style={{ background: 'var(--racing)', color: '#000', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' }}>SPRINT WEEKEND</span>}
              <img 
                src={`https://flagcdn.com/w80/${nextRace.countryCode.toLowerCase()}.png`} 
                alt={nextRace.countryCode} 
                className="race-flag-big" 
                style={{ width: '42px', height: '26px', objectFit: 'cover', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-block' }}
              />
            </div>
            
            <h2 className="race-name">
              {nextRace.title.replace('Grand Prix', '')}
              <em style={{ color: 'var(--racing)', fontStyle: 'italic' }}>Grand Prix</em>
            </h2>

            <div className="race-circuit">
              <strong>{nextRace.circuit}</strong> 
              {nextRace.venue ? ` · ${nextRace.venue}` : ` · ${nextRace.location}`}
            </div>
            
            <div className="race-circuit" style={{ opacity: 0.9, fontSize: '1rem', marginTop: '8px' }}>
              Round {nextRace.roundNumber} of {calendar?.rounds?.length || 24} · {nextRace.laps} laps · {nextRace.distance} km
            </div>

            <div className="race-stats" style={{ marginTop: '32px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
              <div className="race-stat">
                <div className="race-stat-label">
                  {activeSession ? (
                    isLive ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span className="live-dot-pulsing" style={{ width: '6px', height: '6px', borderRadius: '50%', background: liveStatus === 'red_flag' ? '#e10600' : liveStatus === 'safety_car' || liveStatus === 'vsc' ? '#d4a017' : 'var(--racing-hot, var(--racing))', animation: 'pulseDot 1.5s ease infinite' }}></span>
                        {activeSession.name} (LIVE)
                      </span>
                    ) : activeSession.name
                  ) : 'Race Day'}
                </div>
                <div className="race-stat-val" style={{ color: liveStatus === 'red_flag' ? '#e10600' : liveStatus === 'safety_car' || liveStatus === 'vsc' ? '#d4a017' : isLive ? 'var(--racing-hot, var(--racing))' : 'var(--racing)' }}>
                  {activeSession ? (
                    liveStatus === 'red_flag' ? 'RED FLAG' :
                    liveStatus === 'safety_car' ? 'SAFETY CAR' :
                    liveStatus === 'vsc' ? 'VSC ACTIVE' :
                    isLive ? 'IN PROGRESS' : formatLocalTime(activeSession.start)
                  ) : nextRace.dates}
                </div>
              </div>
              <div className="race-stat">
                <div className="race-stat-label">Lap Record</div>
                <div className="race-stat-val">{nextRace.lapRecord}</div>
              </div>
              <div className="race-stat">
                <div className="race-stat-label">Prev. Winner</div>
                <div className="race-stat-val">{nextRace.previousWinner}</div>
              </div>
            </div>
          </div>

          <div className="race-right">
            <div className={`countdown-label ${isLive ? 'live' : ''} ${liveStatus === 'red_flag' ? 'red-flag-label' : ''}`}>
              {activeSession ? (
                liveStatus === 'red_flag' ? (
                  `${activeSession.name.toUpperCase()} SUSPENDED`
                ) : isLive ? (
                  `${activeSession.name.toUpperCase()} ENDS IN`
                ) : (
                  `${activeSession.name.toUpperCase()} STARTS IN`
                )
              ) : 'LIGHTS OUT IN'}
            </div>
            {liveStatus === 'red_flag' ? (
              <div className="red-flag-alert-banner">
                <div className="red-flag-text-pulse">RED FLAG</div>
                <div className="red-flag-subtext">SESSION SUSPENDED</div>
              </div>
            ) : (
              <div className="countdown">
                <div className="cd-cell"><div className="cd-num" id="cd-d">{formatNumber(days)}</div><div className="cd-label">Days</div></div>
                <div className="cd-cell"><div className="cd-num" id="cd-h">{formatNumber(hours)}</div><div className="cd-label">Hours</div></div>
                <div className="cd-cell"><div className="cd-num" id="cd-m">{formatNumber(minutes)}</div><div className="cd-label">Mins</div></div>
                <div className="cd-cell"><div className="cd-num" id="cd-s">{formatNumber(seconds)}</div><div className="cd-label">Secs</div></div>
              </div>
            )}

            <div className="countdown-tabs">
              <button 
                type="button" 
                className="countdown-tab-btn"
                onClick={() => {
                  if (commentaryMode === 'demo') {
                    setShowAlert(true)
                  } else {
                    setCurrentPage('live-feed')
                    setCommentaryTab('live')
                  }
                }}
              >
                📡 LIVE PIT WALL (TELEMETRY & COMMENTARY)
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RaceHero
