import useStore, { getNextRaceName } from '../store/useStore'
import { useCountdown } from '../hooks/useCountdown'
import { formatNumber } from '../utils/format'

const RaceHero = () => {
  const { nextRace } = useStore((state) => state.race)
  const nextRaceName = useStore(getNextRaceName)
  const { days, hours, minutes, seconds } = useCountdown(nextRace?.date)
  const isLoading = useStore((state) => state.isLoadingRace)

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

  if (!nextRace) {
    return (
      <section className="race-hero">
        <div className="race-block" style={{ minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h2 className="race-name" style={{ color: '#666' }}>Next Race Unavailable</h2>
        </div>
      </section>
    )
  }

  return (
    <section className="race-hero">
      <div className="race-block">
        <div className="race-grid">
          <div className="race-left">
            <div className="race-meta-row">
              <span className="race-round">◆ {nextRace.round} · {nextRace.status}</span>
              <span className="race-flag-big">{nextRace.flag}</span>
            </div>
            <h2 className="race-name">{nextRaceName}</h2>
            <div className="race-circuit"><strong>{nextRace.circuit}</strong> · {nextRace.location}</div>
            <div className="race-circuit">{nextRace.details}</div>

            <div className="race-stats">
              {nextRace.stats && nextRace.stats.length > 0 ? (
                nextRace.stats.map((stat, idx) => (
                  <div className="race-stat" key={idx}>
                    <div className="race-stat-label">{stat.label}</div>
                    <div className="race-stat-val">{stat.value}</div>
                  </div>
                ))
              ) : (
                <div className="race-stat">
                  <div className="race-stat-label">Race Information</div>
                  <div className="race-stat-val">Loading specifics...</div>
                </div>
              )}
            </div>
          </div>

          <div className="race-right">
            <div className="countdown-label">Lights Out In</div>
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
