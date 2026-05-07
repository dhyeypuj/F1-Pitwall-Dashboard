import useStore from '../store/useStore'
import { updateUserPreferences } from '../services/userService'

const TEAMS = [
  { id: 'ferrari', name: 'Scuderia Ferrari HP', color: '#DC0000' },
  { id: 'mercedes', name: 'Mercedes-AMG PETRONAS', color: '#00D2BE' },
  { id: 'redbull', name: 'Oracle Red Bull Racing', color: '#0600EF' },
  { id: 'mclaren', name: 'McLaren Formula 1', color: '#FF8700' },
  { id: 'astonmartin', name: 'Aston Martin Aramco', color: '#006F62' },
  { id: 'williams', name: 'Atlassian Williams Racing', color: '#005AFF' },
  { id: 'alpine', name: 'BWT Alpine F1 Team', color: '#FF4F9F' },
  { id: 'haas', name: 'MoneyGram Haas F1 Team', color: '#E10600' },
  { id: 'racingbulls', name: 'Visa Cash App Racing Bulls', color: '#2B6BFF' },
  { id: 'audi', name: 'Audi F1 Team', color: '#E60012' },
  { id: 'cadillac', name: 'Cadillac F1 Team', color: '#D4AF37' }
]

const SettingsPanel = () => {
  const isOpen = useStore(state => state.isSettingsOpen)
  const toggleSettings = useStore(state => state.toggleSettings)
  const preferences = useStore(state => state.preferences || {})
  const updatePreference = useStore(state => state.updatePreference)
  const user = useStore(state => state.user)

  if (!isOpen) return null

  // Ensure widgets object exists to prevent crashes
  const widgets = preferences.widgets || {
    news: true,
    standings: true,
    podium: true,
    stats: true,
    calendar: true
  }

  const handleTeamSelect = async (teamId) => {
    if (updatePreference) {
      updatePreference('team', teamId)
      if (user?.uid) {
        await updateUserPreferences(user.uid, { ...preferences, team: teamId })
      }
    }
  }

  const handleWidgetToggle = async (widgetKey) => {
    if (updatePreference) {
      const newWidgets = {
        ...widgets,
        [widgetKey]: !widgets[widgetKey]
      }
      updatePreference('widgets', newWidgets)
      if (user?.uid) {
        await updateUserPreferences(user.uid, { ...preferences, widgets: newWidgets })
      }
    }
  }

  return (
    <div className="settings-overlay" onClick={toggleSettings}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <div className="settings-title">
            <span className="checker-flag small"></span>
            <h2>PIT WALL SETTINGS</h2>
          </div>
          <button className="settings-close" onClick={toggleSettings}>&times;</button>
        </div>

        <div className="settings-section">
          <label className="section-label">FAVORITE TEAM / THEME</label>
          <div className="team-grid">
            {TEAMS.map(team => (
              <button 
                key={team.id}
                className={`team-btn ${preferences.team === team.id ? 'active' : ''}`}
                onClick={() => handleTeamSelect(team.id)}
              >
                <span className="team-swatch" style={{ background: team.color }}></span>
                <span className="team-name">{team.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <label className="section-label">DASHBOARD WIDGETS</label>
          <div className="widget-toggles">
            {Object.keys(widgets).map(key => (
              <div className="toggle-row" key={key}>
                <span className="toggle-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={widgets[key]} 
                    onChange={() => handleWidgetToggle(key)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-footer">
          <p>PERSONAL EDITION · F1 2026</p>
          <div className="theme-preview">
            <div className="preview-swatch primary"></div>
            <div className="preview-swatch accent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
