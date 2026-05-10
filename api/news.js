import { fetchRSSNews } from '../src/server/rssService.js'

// Simple in-memory cache for the serverless instance
// Note: This only persists during the life of the warm function instance.
let cache = {
  data: null,
  timestamp: 0
}
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const now = Date.now()

    // If cache is valid, return it
    if (cache.data && (now - cache.timestamp < CACHE_TTL)) {
      return res.status(200).json(cache.data)
    }

    // Otherwise, fetch fresh news
    const data = await fetchRSSNews()

    // Update cache
    cache.data = data
    cache.timestamp = now

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error in Vercel API /api/news:', error)
    return res.status(500).json({ error: 'Failed to fetch F1 news' })
  }
}
