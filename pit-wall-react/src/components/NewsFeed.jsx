const NewsFeed = () => {
  return (
    <div className="news-block">
      <article className="news-item lead">
        <div className="news-meta"><span className="news-kicker">The Story</span><span className="news-num">01</span></div>
        <h3 className="news-headline">Antonelli's rookie surge rewrites Mercedes' championship math</h3>
        <p className="news-body">Three rounds in, the 19-year-old Italian has back-to-back wins and sits atop the drivers' table. Wolff has already shifted team orders mid-weekend. Russell now races his own teammate for the title.</p>
      </article>
      <article className="news-item neutral">
        <div className="news-meta"><span className="news-kicker">Engine Wars</span><span className="news-num">02</span></div>
        <h3 className="news-headline">Red Bull's new PU is down 15hp to Mercedes, paddock sources say</h3>
        <p className="news-body">Despite the full Ford works programme, Red Bull's 2026 power unit appears weakest on the grid. Verstappen's P5 in Japan came from chassis, not pace.</p>
      </article>
      <article className="news-item neutral">
        <div className="news-meta"><span className="news-kicker">Debut</span><span className="news-num">03</span></div>
        <h3 className="news-headline">Cadillac goal is simple: finish races, learn fast, build for 2029</h3>
        <p className="news-body">GM's eleventh team runs Ferrari PUs until its in-house unit is ready. Herta confirmed for four FP1 outings this year.</p>
      </article>
      <article className="news-item">
        <div className="news-meta"><span className="news-kicker">Calendar</span><span className="news-num">04</span></div>
        <h3 className="news-headline">FIA confirms Bahrain and Saudi cancellations, no replacements</h3>
        <p className="news-body">Iran war fallout leaves the season at 23 rounds, Australia to Abu Dhabi. Feeder series affected too.</p>
      </article>
    </div>
  )
}

export default NewsFeed
