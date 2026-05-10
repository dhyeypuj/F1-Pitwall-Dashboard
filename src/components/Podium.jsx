import useStore from '../store/useStore'

const Podium = () => {
  const podium = useStore((state) => state.podium)

  return (
    <div className="podium-block">
      <div className="podium-head">{podium.title || 'Latest Race Result'}</div>
      <div className="podium-list">
        {podium.results.length === 0 ? (
          Array(3).fill(0).map((_, i) => (
            <div className={`pod-row p${i + 1} skeleton`} key={`skel-pod-${i}`} style={{ opacity: 0.5 }}>
              <div className="pod-badge">P{i + 1}</div>
              <div>
                <div className="pod-driver-name" style={{ background: '#333', width: '100px', height: '16px', borderRadius: '4px' }}></div>
                <div className="pod-driver-team" style={{ background: '#222', width: '80px', height: '12px', borderRadius: '4px', marginTop: '4px' }}></div>
              </div>
              <div className="pod-time" style={{ background: '#222', width: '60px', height: '14px', borderRadius: '4px' }}></div>
            </div>
          ))
        ) : (
          podium.results.map((res) => (
            <div className={`pod-row ${res.cls}`} key={res.id}>
              <div className="pod-badge">{res.badge}</div>
              <div>
                <div className="pod-driver-name">
                  <img 
                    src={res.flagUrl} 
                    alt={res.nationality} 
                    className="driver-flag" 
                    onError={(e) => e.target.style.display = 'none'} 
                    style={{ marginRight: '8px' }}
                  />
                  {res.name}
                  {res.logoUrl && (
                    <img 
                      src={res.logoUrl} 
                      alt={res.team} 
                      className="driver-team-logo" 
                      onError={(e) => e.target.style.display = 'none'} 
                    />
                  )}
                </div>
                <div className="pod-driver-team">{res.team}</div>
              </div>
              <div className="pod-time">{res.time}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Podium
