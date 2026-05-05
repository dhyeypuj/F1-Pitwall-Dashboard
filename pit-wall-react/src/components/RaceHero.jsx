import useStore, { getNextRaceName } from '../store/useStore'

const RaceHero = () => {
  const { nextRace } = useStore((state) => state.race)
  const nextRaceName = useStore(getNextRaceName)

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
              {nextRace.stats.map((stat, idx) => (
                <div className="race-stat" key={idx}>
                  <div className="race-stat-label">{stat.label}</div>
                  <div className="race-stat-val">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="race-right">
            <div className="countdown-label">Lights Out In</div>
            <div className="countdown">
              <div className="cd-cell"><div className="cd-num" id="cd-d">00</div><div className="cd-label">Days</div></div>
              <div className="cd-cell"><div className="cd-num" id="cd-h">00</div><div className="cd-label">Hours</div></div>
              <div className="cd-cell"><div className="cd-num" id="cd-m">00</div><div className="cd-label">Mins</div></div>
              <div className="cd-cell"><div className="cd-num" id="cd-s">00</div><div className="cd-label">Secs</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RaceHero
