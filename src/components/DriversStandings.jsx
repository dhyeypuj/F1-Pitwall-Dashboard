import useStore from '../store/useStore'
import { getDriverNumberImage } from '../services/f1Service'

const DriversStandings = () => {
  const drivers = useStore((state) => state.standings.drivers)
  const isLoading = useStore((state) => state.isLoadingStandings)
  const error = useStore((state) => state.errorStandings)

  return (
    <div className="col">
      <div className="col-head">
        <div className="col-num">§ 01</div>
        <div className="col-name">World Drivers' Championship <em>Standings</em></div>
      </div>

      {isLoading ? (
        Array(10).fill(0).map((_, i) => (
          <div className="driver-row skeleton" key={`skel-d-${i}`} style={{ opacity: 0.5, animationDelay: `${4.5 + i * 0.08}s` }}>
            <div className="driver-top has-face">
              <div className="driver-pos">--</div>
              <div className="driver-face-wrap skeleton-face" style={{ background: 'var(--surface-3)', border: '1.5px solid var(--surface-3)', width: '56px', height: '56px', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }}></div>
              <div className="driver-info">
                <div className="driver-line" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="driver-name" style={{ background: 'var(--surface-3)', width: '120px', height: '16px', display: 'inline-block', borderRadius: '4px' }}></span>
                </div>
                <div className="driver-team" style={{ background: 'var(--surface-2)', width: '80px', height: '12px', display: 'inline-block', borderRadius: '4px', marginTop: '4px' }}></div>
              </div>
              <div className="driver-pts-wrap">
                <div className="driver-pts" style={{ background: 'var(--surface-3)', width: '30px', height: '16px', display: 'inline-block', borderRadius: '4px' }}></div>
              </div>
            </div>
          </div>
        ))
      ) : error || drivers.length === 0 ? (
        <div className="driver-row" style={{ justifyContent: 'center', padding: '2rem 0' }}>
          <div className="driver-name" style={{ color: error ? 'var(--racing)' : '#666' }}>{error || 'Standings Unavailable'}</div>
        </div>
      ) : (
        drivers.map((d, i) => (
          <div 
            className={`driver-row ${i === 0 ? 'leader' : ''}`} 
            style={{ '--team-color': d.color, animationDelay: `${i * 0.05}s` }}
            key={d.code}
          >
            <div className={`driver-top ${d.imageUrl ? 'has-face' : ''}`}>
              <div className="driver-pos">{d.pos}</div>
              {d.imageUrl && (
                <div className="driver-face-wrap">
                  <img 
                    src={d.imageUrl} 
                    alt={d.name} 
                    className="driver-face" 
                    onError={(e) => { e.target.parentNode.style.display = 'none'; }}
                  />
                </div>
              )}
              <div className="driver-info">
                <div className="driver-line">
                  <span className="driver-name">{d.name}</span>
                  <span className="driver-code-badge" style={{ backgroundColor: d.color }}>
                    {d.code}
                  </span>
                  <img 
                    src={getDriverNumberImage(d.fullName || d.name, d.constructorId)} 
                    alt="" 
                    className="driver-number-logo" 
                    onError={(e) => e.target.style.display = 'none'} 
                  />
                  {d.logoUrl && (
                    <img 
                      src={d.logoUrl} 
                      alt={d.team} 
                      className="driver-team-logo" 
                      onError={(e) => e.target.style.display = 'none'}
                    />
                  )}
                </div>
                <div className="driver-team">
                  <img 
                    src={d.flagUrl} 
                    alt={d.nationality} 
                    className="driver-flag" 
                    onError={(e) => e.target.style.display = 'none'}
                  />
                  {d.team} · {d.nationality}{d.gap && <> · <span className="gap">{d.gap}</span></>}
                </div>
              </div>
              <div className="driver-pts-wrap">
                <div className="driver-pts">{d.points}</div>
                <div className="driver-pts-sub">pts</div>
              </div>
            </div>
            <div className="driver-bar">
              <div 
                className="driver-bar-fill" 
                style={{ width: d.width, animationDelay: d.width !== '0%' ? `${5.5 + i * 0.05}s` : undefined }}
              ></div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default DriversStandings
