import useStore from '../store/useStore'

const Ticker = () => {
  const ticker = useStore((state) => state.ticker)
  
  return (
    <div className="ticker-wrap">
      <div className="ticker-track" id="tkTrack">
        {ticker.map((it, i) => (
          <span key={`ticker-1-${i}`}>
            <span className="tick">
              <span className="sym">{it.sym}</span>{' '}
              <span className="val">{it.val}</span>{' '}
              <span className="pts">{it.pts}</span>
            </span>
            <span className="tick tick-dot">◆</span>
          </span>
        ))}
        {ticker.map((it, i) => (
          <span key={`ticker-2-${i}`}>
            <span className="tick">
              <span className="sym">{it.sym}</span>{' '}
              <span className="val">{it.val}</span>{' '}
              <span className="pts">{it.pts}</span>
            </span>
            <span className="tick tick-dot">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default Ticker
