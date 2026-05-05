import useStore from '../store/useStore'

const NewsFeed = () => {
  const news = useStore((state) => state.news)

  return (
    <div className="news-block">
      {news.map((item) => (
        <article className={`news-item ${item.type || ''}`} key={item.id}>
          <div className="news-meta">
            {item.kicker && <span className="news-kicker">{item.kicker}</span>}
            <span className="news-num">{item.id}</span>
          </div>
          <h3 className="news-headline">{item.headline}</h3>
          <p className="news-body">{item.body}</p>
        </article>
      ))}
    </div>
  )
}

export default NewsFeed
