import useStore from '../store/useStore'

const ConstructorsStandings = () => {
  const constructors = useStore((state) => state.standings.constructors)
  const isLoading = useStore((state) => state.isLoadingStandings)
  const error = useStore((state) => state.errorStandings)

  return (
    <div className="col">
      <div className="col-head">
        <div className="col-num">§ 02</div>
        <div className="col-name">World Constructors' Championship <em>Standings</em></div>
      </div>

      {isLoading ? (
        Array(10).fill(0).map((_, i) => (
          <div className="con-row skeleton" key={`skel-c-${i}`} style={{ opacity: 0.5, animationDelay: `${4.5 + i * 0.08}s` }}>
            <div className="con-top">
              <div className="con-pos">--</div>
              <div>
                <div className="con-name" style={{ background: 'var(--surface-3)', width: '100px', height: '16px', display: 'inline-block', borderRadius: '4px' }}></div>
                <div className="con-engine" style={{ background: 'var(--surface-2)', width: '60px', height: '12px', display: 'block', borderRadius: '4px', marginTop: '4px' }}></div>
              </div>
              <div className="con-pts" style={{ background: 'var(--surface-3)', width: '30px', height: '16px', display: 'inline-block', borderRadius: '4px' }}></div>
            </div>
            <div className="con-bar">
              <div className="con-bar-fill" style={{ width: '0%' }}></div>
            </div>
          </div>
        ))
      ) : error || constructors.length === 0 ? (
        <div className="con-row" style={{ justifyContent: 'center', padding: '2rem 0' }}>
          <div className="con-name" style={{ color: error ? 'var(--racing)' : '#666' }}>{error || 'Standings Unavailable'}</div>
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
              <div className="con-name">
                {c.logoUrl && (
                  <img 
                    src={c.logoUrl} 
                    alt={c.name} 
                    className="con-team-logo" 
                    onError={(e) => e.target.style.display = 'none'}
                  />
                )}
                {c.name}
              </div>
              <div className="con-engine">
                <img 
                  src={c.flagUrl} 
                  alt={c.nationality} 
                  className="con-flag" 
                  onError={(e) => e.target.style.display = 'none'}
                />
                {c.engine}
              </div>
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
