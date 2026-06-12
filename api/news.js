import { fetchRSSNews } from '../src/server/rssService.js'
import { performance } from 'perf_hooks'

// Simple in-memory cache for the serverless instance
// Note: This only persists during the life of the warm function instance.
let cache = {
  data: null,
  timestamp: 0
}
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

export default async function handler(req, res) {
  const startTime = performance.now()

  // Only allow GET
  if (req.method !== 'GET') {
    const latency = performance.now() - startTime
    res.setHeader('X-Response-Time', `${latency.toFixed(2)}ms`)
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const now = Date.now()

    // If cache is valid, return it
    if (cache.data && (now - cache.timestamp < CACHE_TTL)) {
      const latency = performance.now() - startTime
      res.setHeader('X-Cache', 'HIT')
      res.setHeader('X-Response-Time', `${latency.toFixed(2)}ms`)
      console.log(`[INFO] [api/news] Cache HIT. Latency: ${latency.toFixed(2)}ms`)
      return res.status(200).json(cache.data)
    }

    // Otherwise, fetch fresh news
    console.log('[INFO] [api/news] Cache MISS. Fetching fresh RSS news...')
    const fetchStart = performance.now()
    const data = await fetchRSSNews()
    const fetchDuration = performance.now() - fetchStart

    // Update cache
    cache.data = data
    cache.timestamp = now

    const latency = performance.now() - startTime
    res.setHeader('X-Cache', 'MISS')
    res.setHeader('X-Response-Time', `${latency.toFixed(2)}ms`)
    console.log(`[INFO] [api/news] Fetch complete. Fetch time: ${fetchDuration.toFixed(2)}ms, Total latency: ${latency.toFixed(2)}ms`)

    return res.status(200).json(data)
  } catch (error) {
    const latency = performance.now() - startTime
    console.error(`[ERROR] [api/news] Exception after ${latency.toFixed(2)}ms:`, error)
    return res.status(500).json({ error: 'Failed to fetch F1 news' })
  }
}
