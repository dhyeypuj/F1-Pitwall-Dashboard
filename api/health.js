import { performance } from 'perf_hooks'

export default function handler(req, res) {
  const startTime = performance.now()
  try {
    const latency = performance.now() - startTime
    res.setHeader('X-Response-Time', `${latency.toFixed(2)}ms`)
    return res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      latency: `${latency.toFixed(2)}ms`
    })
  } catch (error) {
    const latency = performance.now() - startTime
    console.error(`[ERROR] [api/health] Exception after ${latency.toFixed(2)}ms:`, error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
