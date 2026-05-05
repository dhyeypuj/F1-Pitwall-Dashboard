import useStore from '../store/useStore'

const ConstructorsStandings = () => {
  const constructors = useStore((state) => state.standings.constructors)

  return (
    <div className="col">
      <div className="col-head">
        <div className="col-num">§ 02</div>
        <div className="col-name">Constructors' <em>Cup</em></div>
        <div className="col-sub">All 11 teams · 2026</div>
      </div>

      {constructors.length === 0 ? (
        <div className="con-row" style={{ justifyContent: 'center', padding: '2rem 0' }}>
          <div className="con-name" style={{ color: '#666' }}>Fetching Standings...</div>
        </div>
      ) : (
        constructors.map((c, i) => (
          <div 
          className="con-row" 
          style={{ '--team-color': c.color, animationDelay: `${4.5 + i * 0.08}s` }}
          key={c.name}
        >
          <div className="con-top">
            <div className="con-pos">{c.pos}</div>
            <div>
              <div className="con-name">{c.name}</div>
              <div className="con-engine">{c.engine}</div>
            </div>
            <div className="con-pts">{c.points}</div>
          </div>
          <div className="con-bar">
            <div 
              className="con-bar-fill" 
              style={{ width: c.width, animationDelay: c.width !== '0%' ? `${5.5 + i * 0.05}s` : undefined }}
            ></div>
          </div>
        </div>
        ))
      )}
    </div>
  )
}

export default ConstructorsStandings
