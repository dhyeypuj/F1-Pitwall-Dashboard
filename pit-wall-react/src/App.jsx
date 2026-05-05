import { useEffect } from 'react'
import Layout from './layout/Layout'
import useStore, { getTeamTheme } from './store/useStore'

function App() {
  const teamTheme = useStore(getTeamTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', teamTheme)
  }, [teamTheme])

  return (
    <div className={`app theme-${teamTheme}`}>
      <Layout />
    </div>
  )
}

export default App
