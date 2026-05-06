import useStore from '../store/useStore'

const NewsFeed = () => {
  const news = useStore((state) => state.news)
  const isLoading = useStore((state) => state.isLoadingNews)
  const error = useStore((state) => state.errorNews)

  return (
    <div className="news-block">
      {isLoading ? (
        Array(4).fill(0).map((_, i) => (
          <article className="news-item skeleton" key={`skel-news-${i}`} style={{ opacity: 0.5 }}>
            <div className="news-meta">
              <span className="news-kicker" style={{ background: '#333', width: '60px', height: '12px', borderRadius: '4px' }}></span>
              <span className="news-num" style={{ background: '#222', width: '40px', height: '12px', borderRadius: '4px' }}></span>
            </div>
            <h3 className="news-headline" style={{ background: '#444', width: '100%', height: '24px', borderRadius: '4px', marginTop: '12px' }}></h3>
            <p className="news-body" style={{ background: '#222', width: '80%', height: '16px', borderRadius: '4px', marginTop: '8px' }}></p>
          </article>
        ))
      ) : error || news.length === 0 ? (
        <article className="news-item" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <h3 className="news-headline" style={{ color: error ? 'var(--ferrari)' : '#666', textAlign: 'center' }}>{error || 'No News Available'}</h3>
        </article>
      ) : (
        news.map((item, i) => (
          <article className={`news-item ${i === 0 ? 'lead' : 'neutral'}`} key={item.id}>
            <div className="news-meta">
              {item.source && <span className="news-kicker">{item.source}</span>}
              <span className="news-num">{new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            <h3 className="news-headline">{item.headline}</h3>
            <p className="news-body">{item.body}</p>
          </article>
        ))
      )}
    </div>
  )
}

export default NewsFeed
