import useStore from '../store/useStore'

const StatsRibbon = () => {
  const stats = useStore((state) => state.stats)

  return (
    <section className="stats-ribbon">
      <div className="stats-grid">
        {stats.length === 0 ? (
          Array(4).fill(0).map((_, i) => (
            <div className="stat skeleton" key={`skel-stat-${i}`} style={{ opacity: 0.5 }}>
              <div className="stat-label" style={{ background: '#222', width: '80px', height: '12px', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div className="stat-big" style={{ background: '#333', width: '120px', height: '24px', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div className="stat-sub" style={{ background: '#222', width: '100px', height: '12px', borderRadius: '4px' }}></div>
            </div>
          ))
        ) : (
          stats.map((stat) => (
            <div className="stat" key={stat.id}>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-big" dangerouslySetInnerHTML={{ __html: stat.bigHtml }}></div>
              <div className="stat-sub">{stat.sub}</div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default StatsRibbon
