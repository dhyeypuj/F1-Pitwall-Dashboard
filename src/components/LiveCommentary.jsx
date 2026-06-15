import { useEffect, useRef, useState } from 'react'
import useStore from '../store/useStore'

function LiveCommentary() {
  const liveCommentary = useStore(state => state.liveCommentary || [])
  const isLoadingCommentary = useStore(state => state.isLoadingCommentary)
  const commentaryError = useStore(state => state.commentaryError)
  const commentaryMode = useStore(state => state.commentaryMode)
  const fetchCommentaryFeed = useStore(state => state.fetchCommentaryFeed)
  
  const [autoScroll, setAutoScroll] = useState(() => {
    const saved = localStorage.getItem('f1_commentary_autoscroll')
    return saved !== null ? JSON.parse(saved) : true
  })
  
  const containerRef = useRef(null)
  const bottomRef = useRef(null)

  // Fetch commentary on mount if empty
  useEffect(() => {
    if (liveCommentary.length === 0) {
      fetchCommentaryFeed()
    }
  }, [fetchCommentaryFeed, liveCommentary.length])

  // Persistence of auto-scroll preference
  useEffect(() => {
    localStorage.setItem('f1_commentary_autoscroll', JSON.stringify(autoScroll))
  }, [autoScroll])

  // Handle scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [liveCommentary, autoScroll])

  const handleForceRefresh = () => {
    fetchCommentaryFeed(true)
  }

  const handleJumpToLive = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
    // Also trigger a refresh from the API
    fetchCommentaryFeed(true)
  }

  const getBadgeStyle = (category, message) => {
    const cat = (category || '').toUpperCase()
    const msg = (message || '').toUpperCase()
    
    if (cat === 'FLAG') {
      if (msg.includes('GREEN')) return 'badge-flag-green'
      if (msg.includes('RED')) return 'badge-flag-red'
      if (msg.includes('YELLOW') || msg.includes('DOUBLE')) return 'badge-flag-yellow'
      return 'badge-flag-black-white'
    }
    if (cat === 'SAFETYCAR' || msg.includes('SAFETY CAR')) {
      return 'badge-safetycar'
    }
    if (cat === 'DRS' || msg.includes('DRS')) {
      return 'badge-drs'
    }
    if (cat === 'PIT' || msg.includes('PIT ENTRY') || msg.includes('PITS')) {
      return 'badge-pit'
    }
    if (cat === 'PENALTY' || msg.includes('PENALTY') || msg.includes('INVESTIGATION')) {
      return 'badge-penalty'
    }
    return 'badge-info'
  }

  if (commentaryMode === 'demo') {
    return (
      <div className="commentary-widget-panel coming-soon">
        <div className="commentary-coming-soon-content">
          <span className="coming-soon-icon">💬</span>
          <h3>LIVE COMMENTARY</h3>
          <p>COMING SOON</p>
          <span className="coming-soon-subtext">Will activate automatically when the next session goes live.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="commentary-widget-panel">
      <div className="commentary-header">
        <div className="commentary-status">
          <span className={`status-indicator-dot ${commentaryMode === 'live' ? 'live' : 'offline'}`}></span>
          <span className="commentary-status-text">
            {commentaryMode === 'live' ? 'LIVE COMMENTARY' : 'FALLBACK DEMO FEED'}
          </span>
        </div>
        
        <div className="commentary-controls">
          <label className="checkbox-control" htmlFor="cb-autoscroll">
            <input 
              type="checkbox" 
              id="cb-autoscroll" 
              checked={autoScroll} 
              onChange={(e) => setAutoScroll(e.target.checked)} 
            />
            <span>Auto-Scroll</span>
          </label>
          <button 
            type="button" 
            id="btn-refresh-commentary" 
            className="commentary-btn icon-btn" 
            onClick={handleForceRefresh}
            title="Force refresh"
            disabled={isLoadingCommentary}
          >
            {isLoadingCommentary ? '...' : '⟳'}
          </button>
        </div>
      </div>

      {commentaryError && (
        <div className="commentary-warning-banner">
          <span className="warning-icon">⚠</span>
          <span className="warning-text">{commentaryError}</span>
        </div>
      )}


      <div className="commentary-scroll-container" ref={containerRef}>
        {liveCommentary.length === 0 ? (
          <div className="commentary-empty-state">
            {isLoadingCommentary ? 'INITIALIZING COMMENTARY FEED...' : 'NO LIVE COMMENTARY EVENTS YET.'}
          </div>
        ) : (
          <div className="commentary-list">
            {liveCommentary.map((item) => (
              <div className="commentary-item-card" key={item.id}>
                <div className="commentary-item-meta">
                  <span className="commentary-time">{item.timestamp}</span>
                  {item.lap_number > 0 && (
                    <span className="commentary-lap">LAP {item.lap_number}</span>
                  )}
                  <span className={`commentary-badge ${getBadgeStyle(item.category, item.message)}`}>
                    {(item.category || 'INFO').toUpperCase()}
                  </span>
                </div>
                <div className="commentary-text-content">
                  {item.message}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="commentary-footer">
        <button 
          type="button" 
          id="btn-jump-live" 
          className="commentary-footer-btn" 
          onClick={handleJumpToLive}
        >
          🡇 JUMP TO LIVE
        </button>
      </div>
    </div>
  )
}

export default LiveCommentary
