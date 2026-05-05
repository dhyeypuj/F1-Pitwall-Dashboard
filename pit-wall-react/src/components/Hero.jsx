const Hero = () => {
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
          <div className="greeting" id="greeting">Good morning, Shreya</div>
          <div className="dateline" id="dateline"></div>
        </div>
      </div>

      <div className="title-wrap">
        <h1 className="hero-title">
          <span className="line1"><span>Shreya's</span></span>
          <span className="line2"><span>Pit Wall.</span></span>
        </h1>
        <div className="title-underline"></div>
      </div>

      <div className="hero-sub">
        <span className="live-badge">Live Edition</span>
        <span>Drivers · Constructors · Paddock · Calendar</span>
      </div>
    </section>
  )
}

export default Hero
