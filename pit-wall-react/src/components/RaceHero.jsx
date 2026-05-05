const RaceHero = () => {
  return (
    <section className="race-hero">
      <div className="race-block">
        <div className="race-grid">
          <div className="race-left">
            <div className="race-meta-row">
              <span className="race-round">◆ Round 04 · Up Next</span>
              <span className="race-flag-big">🇺🇸</span>
            </div>
            <h2 className="race-name">Miami <em>Grand Prix</em></h2>
            <div className="race-circuit"><strong>Miami International Autodrome</strong> · Hard Rock Stadium</div>
            <div className="race-circuit">Round 4 of 23 · 57 laps · 308.326 km</div>

            <div className="race-stats">
              <div className="race-stat">
                <div className="race-stat-label">Lap Record</div>
                <div className="race-stat-val">1:29.708</div>
              </div>
              <div className="race-stat">
                <div className="race-stat-label">Pole 2025</div>
                <div className="race-stat-val">M. Verstappen</div>
              </div>
              <div className="race-stat">
                <div className="race-stat-label">Dates</div>
                <div className="race-stat-val">May 1 – 3</div>
              </div>
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
