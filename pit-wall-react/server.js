import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import Parser from 'rss-parser'

const app = express()
const PORT = process.env.PORT || 3001

// 1. CORS — must come first so preflight requests are handled
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))

// 2. Body parsing
app.use(express.json())

// 3. Cookie parsing — after body, before routes
app.use(cookieParser())

const parser = new Parser()

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

let cache = {
  promise: null,
  timestamp: 0,
  data: null
}
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

const fetchRSSNews = async () => {
  const promises = RSS_SOURCES.map(async (source) => {
    try {
      // Direct fetch from the server without CORS proxy
      const feed = await parser.parseURL(source.url)
      
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

app.get('/api/news', async (req, res) => {
  try {
    const now = Date.now()

    // If cache is valid, return it
    if (cache.data && (now - cache.timestamp < CACHE_TTL)) {
      return res.json(cache.data)
    }

    // If a fetch is already in progress, wait for it
    if (cache.promise) {
      const data = await cache.promise
      return res.json(data)
    }

    // Otherwise, start a new fetch
    cache.promise = fetchRSSNews()
    const data = await cache.promise

    // Update cache
    cache.data = data
    cache.timestamp = now
    cache.promise = null

    return res.json(data)
  } catch (error) {
    console.error('Error in /api/news:', error)
    cache.promise = null
    return res.status(500).json({ error: 'Failed to fetch F1 news' })
  }
})

app.listen(PORT, () => {
  console.log(`Express backend running on http://localhost:${PORT}`)
})
