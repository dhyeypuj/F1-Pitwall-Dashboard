import axios from 'axios'

// GNews API (https://gnews.io/) requires an API key.
// Add VITE_NEWS_API_KEY=your_api_key_here to your .env file
const API_KEY = import.meta.env.VITE_NEWS_API_KEY || 'demo'
const BASE_URL = 'https://gnews.io/api/v4'

export const getF1News = async (keyword = '') => {
  try {
    const formattedKeyword = keyword === 'redbull' ? 'Red Bull' : keyword
    const searchQuery = formattedKeyword && formattedKeyword !== 'all' 
      ? `("Formula 1" OR F1) AND "${formattedKeyword}"`
      : '"Formula 1" OR F1'

    const { data } = await axios.get(`${BASE_URL}/search`, {
      params: {
        q: searchQuery,
        lang: 'en',
        max: 5,
        apikey: API_KEY,
        sortby: 'publishedAt'
      }
    })

    if (!data.articles) return []

    return data.articles.map((article, index) => ({
      id: `news-${index}-${new Date(article.publishedAt).getTime()}`,
      headline: article.title,
      body: article.description || article.content,
      source: article.source.name,
      timestamp: article.publishedAt,
      image: article.image || null
    }))
  } catch (error) {
    console.error('Error fetching F1 news:', error)
    throw new Error('Failed to load latest news')
  }
}
