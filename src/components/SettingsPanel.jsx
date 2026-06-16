import useStore from '../store/useStore'
import { analytics } from '../services/analytics'

export const TEAMS = [
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
  const preferences = useStore(state => state.preferences)
  const updatePreference = useStore(state => state.updatePreference)
  const activeSeason = useStore(state => state.activeSeason)

  if (!isOpen) return null

  // Ensure widgets object exists with all required keys to prevent rendering errors
  const defaultWidgets = {
    news: true,
    standings: true,
    podium: true,
    stats: true,
    calendar: true
  }
  const widgets = { ...defaultWidgets, ...(preferences?.widgets || {}) }

  const handleTeamSelect = (teamId) => {
    const oldTeam = preferences?.team || 'ferrari'
    if (oldTeam !== teamId) {
      analytics.trackTeamChange(oldTeam, teamId)
      updatePreference('team', teamId)
    }
  }

  const handleWidgetToggle = (widgetKey) => {
    const isVisible = !widgets[widgetKey]
    analytics.trackWidgetToggle(widgetKey, isVisible)
    const newWidgets = {
      ...widgets,
      [widgetKey]: isVisible
    }
    updatePreference('widgets', newWidgets)
  }

  const handleAppearanceChange = (nextAppearance) => {
    const oldAppearance = preferences?.appearance || 'system'
    if (oldAppearance !== nextAppearance) {
      analytics.trackAppearanceChange(oldAppearance, nextAppearance)
      updatePreference('appearance', nextAppearance)
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
          <button className="settings-close" onClick={toggleSettings} aria-label="Close Settings">&times;</button>
        </div>

        <div className="settings-section">
          <label className="section-label">FAVORITE TEAM / THEME</label>
          <div className="team-grid">
            {TEAMS.map(team => (
              <button 
                key={team.id}
                className={`team-btn ${preferences?.team === team.id ? 'active' : ''}`}
                onClick={() => handleTeamSelect(team.id)}
                title={team.name}
              >
                <span className="team-swatch" style={{ background: team.color }}></span>
                <span className="team-name">{team.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <label className="section-label">APPEARANCE</label>
          <div className="appearance-selector">
            <button 
              className={`appearance-btn ${preferences?.appearance === 'light' ? 'active' : ''}`}
              onClick={() => handleAppearanceChange('light')}
            >
              Light
            </button>
            <button 
              className={`appearance-btn ${preferences?.appearance === 'dark' ? 'active' : ''}`}
              onClick={() => handleAppearanceChange('dark')}
            >
              Dark
            </button>
            <button 
              className={`appearance-btn ${preferences?.appearance === 'system' ? 'active' : ''}`}
              onClick={() => handleAppearanceChange('system')}
            >
              System
            </button>
          </div>
        </div>

        <div className="settings-section">
          <label className="section-label">DASHBOARD WIDGETS</label>
          <div className="widget-toggles">
            {Object.entries(defaultWidgets).map(([key]) => {
              const isEnabled = widgets[key] !== false;
              return (
                <div className="toggle-row" key={key}>
                  <span className="toggle-label">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={isEnabled} 
                      onChange={() => handleWidgetToggle(key)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>

        <div className="settings-footer">
          <p>PERSONAL EDITION · F1 {activeSeason}</p>
          <div className="theme-preview">
            <div className="preview-swatch primary" style={{ background: TEAMS.find(t => t.id === preferences?.team)?.color || 'var(--racing)' }}></div>
            <div className="preview-swatch accent"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
