import http from 'http'
import { fetchRSSNews } from '../src/server/rssService.js'

const PORT = 3001

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url === '/api/news') {
    try {
      const news = await fetchRSSNews()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(news))
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: err.message }))
    }
  } else {
    res.writeHead(404)
    res.end()
  }
})

server.listen(PORT, () => {
  console.log(`Local API Server running at http://localhost:${PORT}`)
})
