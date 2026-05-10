import Ticker from '../components/Ticker'
import Hero from '../components/Hero'
import RaceHero from '../components/RaceHero'
import CalendarStrip from '../components/CalendarStrip'
import DriversStandings from '../components/DriversStandings'
import ConstructorsStandings from '../components/ConstructorsStandings'
import Podium from '../components/Podium'
import NewsFeed from '../components/NewsFeed'
import StatsRibbon from '../components/StatsRibbon'
import Footer from '../components/Footer'

const Layout = () => {
  return (
    <div>
      <Ticker />
      <Hero />
      <RaceHero />
      <CalendarStrip />
      <div>
        <DriversStandings />
        <ConstructorsStandings />
        <Podium />
        <NewsFeed />
      </div>
      <StatsRibbon />
      <Footer />
    </div>
  )
}

export default Layout
