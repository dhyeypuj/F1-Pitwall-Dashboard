import Parser from 'rss-parser'

// Initialize the parser
const parser = new Parser()

// Define RSS feed sources
export const RSS_SOURCES = [
  {
    id: 'bbc',
    name: 'BBC Sport F1',
    url: 'http://feeds.bbci.co.uk/sport/formula1/rss.xml'
  },
  {
    id: 'motorsport',
    name: 'Motorsport F1',
    url: 'https://www.motorsport.com/rss/f1/news/'
  },
  {
    id: 'f1',
    name: 'Formula1.com',
    url: 'https://www.formula1.com/content/fom-website/en/latest/all.xml'
  }
]

let cache = {
  promise: null,
  timestamp: 0
}
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

export const getRSSNews = async () => {
  const now = Date.now()

  if (cache.promise && (now - cache.timestamp < CACHE_TTL)) {
    return cache.promise
  }

  const fetchLogic = async () => {
    // Using a public CORS proxy because browser-to-RSS fetches will be blocked by CORS
    const CORS_PROXY = 'https://corsproxy.io/?'

  const promises = RSS_SOURCES.map(async (source) => {
    try {
      const feed = await parser.parseURL(`${CORS_PROXY}${encodeURIComponent(source.url)}`)
      
      return feed.items.map((item, index) => ({
        id: `rss-${source.id}-${index}-${Date.now()}`,
        headline: item.title || 'Untitled',
        body: item.contentSnippet || item.content || 'No description available.',
        source: source.name,
        timestamp: item.pubDate || item.isoDate || new Date().toISOString(),
        link: item.link || '#'
      }))
    } catch (error) {
      console.error(`Error fetching RSS from ${source.name}:`, error)
      return [] // Fail safely
    }
  })

    const unmerged = await Promise.all(promises)

    // Combine, sort descending by date, and limit to top 15
    return unmerged
      .flat()
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 15)
  }

  cache.promise = fetchLogic().catch(err => {
    cache.promise = null // Clear cache on failure
    throw err
  })
  cache.timestamp = now

  return cache.promise
}
