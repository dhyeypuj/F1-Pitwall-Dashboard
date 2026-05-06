import axios from 'axios'

export const getF1News = async (keyword = '') => {
  try {
    const { data } = await axios.get('/api/news')
    
    if (!data) return []

    // Map the RSS data to match the expected format in the frontend components
    return data.map((article, index) => ({
      id: article.id || `news-${index}-${new Date().getTime()}`,
      headline: article.headline || article.title,
      body: article.body || article.contentSnippet || article.content || 'No description available.',
      source: article.source || 'F1 News',
      timestamp: article.timestamp || new Date().toISOString(),
      image: article.image || null
    }))
  } catch (error) {
    console.error('Error fetching F1 news from backend:', error)
    throw new Error('Failed to load latest news')
  }
}
