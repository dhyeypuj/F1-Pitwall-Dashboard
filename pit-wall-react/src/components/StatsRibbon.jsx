import useStore from '../store/useStore'

const StatsRibbon = () => {
  const stats = useStore((state) => state.stats)

  return (
    <section className="stats-ribbon">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat" key={stat.id}>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-big" dangerouslySetInnerHTML={{ __html: stat.bigHtml }}></div>
            <div className="stat-sub">{stat.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsRibbon
