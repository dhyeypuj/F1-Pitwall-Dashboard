import useStore from '../store/useStore'

const CalendarStrip = () => {
  const calendar = useStore((state) => state.calendar)

  return (
    <section className="cal-section">
      <div className="cal-head">
        <div className="cal-title">Season <em>Calendar</em></div>
        <div className="cal-meta">{calendar.meta}</div>
      </div>

      <div className="cal-strip-wrap">
        <div className="cal-progress-track">
          <div className="cal-progress-fill" style={{ width: calendar.progress }}></div>
        </div>
        <div className="cal-strip" id="calStrip">
          {calendar.rounds.length === 0 ? (
            <div className="cal-round" style={{ flex: 1, justifyContent: 'center' }}>
              <div className="cal-rnum" style={{ color: '#666' }}>Fetching Calendar...</div>
            </div>
          ) : (
            calendar.rounds.map((r) => {
              const className = `cal-round ${r.done ? 'done' : ''} ${r.next ? 'next' : ''}`.trim()
            return (
              <div className={className} key={r.id}>
                <div className="cal-rnum">{r.num}<span className="cal-status-dot"></span></div>
                <div className="cal-flag-emoji">{r.emoji}</div>
                <div className="cal-country">{r.country}</div>
                <div className="cal-flag-name">{r.name}</div>
                <div className="cal-date">{r.date}</div>
                {r.winner ? <div className="cal-winner">{r.winner}</div> : r.status ? <div className="cal-r-status">{r.status}</div> : null}
              </div>
            )
            })
          )}
        </div>
      </div>
    </section>
  )
}

export default CalendarStrip
