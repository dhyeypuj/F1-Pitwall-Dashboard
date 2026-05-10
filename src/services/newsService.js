import { NEWS_ENDPOINT } from '../config/api'

export const getF1News = async (keyword = '') => {
  try {
    const response = await fetch(NEWS_ENDPOINT)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    if (!data) return []

    // Map the RSS data to match the expected format in the frontend components
    return data.map((article, index) => ({
      id: article.id || `news-${index}-${Date.now()}`,
      headline: article.headline,
      body: article.body,
      source: article.source,
      timestamp: article.timestamp,
      image: article.image || null,
      link: article.link || '#'
    }))
  } catch (error) {
    console.error('Error fetching F1 news from backend:', error)
    throw new Error('Failed to load latest news')
  }
}
