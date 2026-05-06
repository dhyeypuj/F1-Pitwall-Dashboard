import useStore from '../store/useStore'

const CalendarStrip = () => {
  const calendar = useStore((state) => state.calendar)
  const isLoading = useStore((state) => state.isLoadingCalendar)
  const error = useStore((state) => state.errorCalendar)

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
          {isLoading ? (
            Array(8).fill(0).map((_, i) => (
              <div className="cal-round skeleton" key={`skel-cal-${i}`} style={{ opacity: 0.5 }}>
                <div className="cal-rnum" style={{ background: '#333', width: '40px', height: '12px', borderRadius: '4px' }}></div>
                <div className="cal-flag-emoji" style={{ opacity: 0.1 }}>🏁</div>
                <div className="cal-country" style={{ background: '#222', width: '60px', height: '16px', borderRadius: '4px' }}></div>
                <div className="cal-flag-name" style={{ background: '#222', width: '80px', height: '12px', borderRadius: '4px', marginTop: '4px' }}></div>
              </div>
            ))
          ) : error || calendar.rounds.length === 0 ? (
            <div className="cal-round" style={{ flex: 1, justifyContent: 'center' }}>
              <div className="cal-rnum" style={{ color: error ? 'var(--ferrari)' : '#666' }}>{error || 'Calendar Unavailable'}</div>
            </div>
          ) : (
            calendar.rounds.map((r) => {
              const className = `cal-round ${r.done ? 'done' : ''} ${r.next ? 'next' : ''}`.trim()
            return (
              <div className={className} key={r.id}>
                <div className="cal-rnum">{r.num}<span className="cal-status-dot"></span></div>
                <div className="cal-flag">
                  {r.flagUrl ? (
                    <img src={r.flagUrl} alt={r.country} className="cal-flag-img" />
                  ) : (
                    r.emoji
                  )}
                </div>
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
