import { fetchRSSNews } from '../src/server/rssService.js'

async function test() {
  console.log('Fetching news...')
  try {
    const news = await fetchRSSNews()
    console.log(`Success! Fetched ${news.length} items.`)
    console.log('First item:', news[0])
  } catch (err) {
    console.error('FAILED TO FETCH NEWS:', err)
  }
}

test()
