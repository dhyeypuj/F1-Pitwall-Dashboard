import Parser from 'rss-parser'

// Use native timeout support in rss-parser
const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) F1-Dashboard/1.0' }
})

const RSS_SOURCES = [
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

/**
 * Fetches and aggregates F1 news from multiple RSS sources.
 * Returns a normalized array of articles.
 */
export const fetchRSSNews = async () => {
  const promises = RSS_SOURCES.map(async (source) => {
    try {
      const feed = await parser.parseURL(source.url)
      
      if (!feed || !feed.items) return []

      return feed.items.map((item, index) => ({
        id: item.guid || item.id || `rss-${source.id}-${index}-${Date.now()}`,
        headline: item.title || 'Untitled',
        body: item.contentSnippet || item.content || 'No description available.',
        source: source.name,
        timestamp: item.pubDate || item.isoDate || new Date().toISOString(),
        link: item.link || '#'
      }))
    } catch (error) {
      console.error(`Error fetching RSS from ${source.name}:`, error.message)
      return []
    }
  })

  const results = await Promise.all(promises)

  return results
    .flat()
    .filter(item => item.headline && item.headline !== 'Untitled')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 15)
}
