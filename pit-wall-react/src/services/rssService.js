import Parser from 'rss-parser'

// Initialize the parser
const parser = new Parser()

// Define RSS feed sources
export const RSS_SOURCES = [
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
