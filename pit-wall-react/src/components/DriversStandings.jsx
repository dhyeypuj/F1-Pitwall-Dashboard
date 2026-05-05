import useStore from '../store/useStore'

const DriversStandings = () => {
  const drivers = useStore((state) => state.standings.drivers)

  return (
    <div className="col">
      <div className="col-head">
        <div className="col-num">§ 01</div>
        <div className="col-name">Drivers' <em>Championship</em></div>
        <div className="col-sub">Top 10 · After 3 Rounds</div>
      </div>

      {drivers.map((d, i) => (
        <div 
          className={`driver-row ${i === 0 ? 'leader' : ''}`} 
          style={{ '--team-color': d.color, animationDelay: `${4.5 + i * 0.08}s` }}
          key={d.code}
        >
          <div className="driver-pos">{d.pos}</div>
          <div className="driver-info">
            <div className="driver-line">
              <span className="driver-name">{d.name}</span>
              <span 
                className="driver-code" 
                style={{ background: d.codeBg || d.color, color: d.codeColor || '#fff' }}
              >
                {d.code}
              </span>
            </div>
            <div className="driver-team">
              {d.team} · {d.nationality}{d.gap && <> · <span className="gap">{d.gap}</span></>}
            </div>
          </div>
          <div className="driver-pts-wrap">
            <div className="driver-pts">{d.points}</div>
            <div className="driver-pts-sub">pts</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default DriversStandings
