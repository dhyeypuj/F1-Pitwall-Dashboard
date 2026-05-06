import useStore, { getTopDriver } from '../store/useStore'

const Hero = () => {
  const user = useStore((state) => state.user)
  const heroStats = useStore((state) => state.heroStats)


  return (
    <section className="hero">
      <span className="speed-line"></span>
      <span className="speed-line"></span>
      <span className="speed-line"></span>

      <div className="hero-top">
        <div className="brand-eyebrow">
          <span className="checker-flag"></span>
          <span>Personal Edition · F1 2026</span>
        </div>
        <div className="brand-right">
          <div className="greeting" id="greeting">{user?.greeting}</div>
          <div className="dateline" id="dateline">{user?.date}</div>
        </div>
      </div>

      <div className="title-wrap">
        <h1 className="hero-title">
          <span className="line1"><span>{user?.name}'s</span></span>
          <span className="line2"><span>Pit Wall.</span></span>
        </h1>
        <div className="title-underline"></div>
      </div>

      <div className="hero-sub">
        <span className="live-badge">Live Edition</span>
        <span>Drivers · Constructors · Paddock · Calendar</span>
      </div>

      <div className="h-status-grid">
        {heroStats.length === 0 ? (
          <>
            <div className="h-stat-box skeleton" style={{ opacity: 0.5 }}><div className="h-stat-val">--</div><div className="h-stat-lbl">Loading...</div></div>
            <div className="h-stat-box skeleton" style={{ opacity: 0.5 }}><div className="h-stat-val">--</div><div className="h-stat-lbl">Loading...</div></div>
            <div className="h-stat-box skeleton" style={{ opacity: 0.5 }}><div className="h-stat-val">--</div><div className="h-stat-lbl">Loading...</div></div>
          </>
        ) : (
          heroStats.map((stat, i) => (
            <div className="h-stat-box" key={`hs-${i}`}>
              <div className="h-stat-val">{stat.val}</div>
              <div className="h-stat-lbl">{stat.lbl}</div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default Hero
