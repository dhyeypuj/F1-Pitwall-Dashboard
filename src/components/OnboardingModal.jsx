import { useState } from 'react'
import useStore from '../store/useStore'
import { TEAMS } from './SettingsPanel'
import { analytics } from '../services/analytics'

const OnboardingModal = () => {
  const user = useStore(state => state.user)
  const preferences = useStore(state => state.preferences)
  const updatePreference = useStore(state => state.updatePreference)
  
  const [step, setStep] = useState(1) // 1: Team, 2: Widgets

  // Only show if user is authenticated but hasn't explicitly selected a team yet
  if (!user || preferences.hasSelectedTeam) return null

  const handleTeamSelect = (teamId) => {
    updatePreference('team', teamId)
    setStep(2)
  }

  const handleWidgetToggle = (key) => {
    const current = preferences.widgets || {}
    updatePreference('widgets', {
      ...current,
      [key]: !current[key]
    })
  }

  const finalizeOnboarding = () => {
    analytics.trackOnboardingComplete(preferences.team || 'ferrari', preferences.appearance || 'system')
    updatePreference('hasSelectedTeam', true)
  }

  const WIDGET_LABELS = {
    news: "Live News Feed",
    standings: "Championship Standings",
    podium: "Latest Race Podium",
    stats: "Performance Analytics",
    calendar: "Season Calendar"
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <div className="onboarding-step-indicator">
          <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
          <div className="step-line"></div>
          <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
          <div className="step-line"></div>
          <div className={`step-dot ${step >= 3 ? 'active' : ''}`}></div>
        </div>

        {step === 1 ? (
          <>
            <div className="onboarding-header">
              <div className="checker-flag large"></div>
              <h1>CHOOSE YOUR ALLEGIANCE</h1>
              <p>Select your team to personalize your dashboard theme and news focus.</p>
            </div>

            <div className="team-selection-area">
              <div className="onboarding-team-grid">
                {TEAMS.map(team => (
                  <button 
                    key={team.id}
                    className={`onboarding-team-btn ${preferences.team === team.id ? 'selected' : ''}`}
                    onClick={() => handleTeamSelect(team.id)}
                  >
                    <div className="team-card-inner">
                      <div className="team-color-strip" style={{ background: team.color }}></div>
                      <span className="team-name">{team.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : step === 2 ? (
          <>
            <div className="onboarding-header">
              <h2 className="step-title">SELECT APPEARANCE MODE</h2>
              <p>Choose how your dashboard is displayed. You can adjust this later in settings.</p>
            </div>

            <div className="appearance-selection-area">
              <div className="onboarding-appearance-grid">
                <button 
                  className={`onboarding-appearance-btn ${preferences.appearance === 'light' ? 'selected' : ''}`}
                  onClick={() => updatePreference('appearance', 'light')}
                >
                  <div className="appearance-card-inner">
                    <div className="appearance-preview light">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="sun-svg">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                      </svg>
                    </div>
                    <span className="appearance-label">Light Mode</span>
                  </div>
                </button>

                <button 
                  className={`onboarding-appearance-btn ${preferences.appearance === 'dark' ? 'selected' : ''}`}
                  onClick={() => updatePreference('appearance', 'dark')}
                >
                  <div className="appearance-card-inner">
                    <div className="appearance-preview dark">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="moon-svg">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                      </svg>
                    </div>
                    <span className="appearance-label">Dark Mode</span>
                  </div>
                </button>

                <button 
                  className={`onboarding-appearance-btn ${preferences.appearance === 'system' ? 'selected' : ''}`}
                  onClick={() => updatePreference('appearance', 'system')}
                >
                  <div className="appearance-card-inner">
                    <div className="appearance-preview system">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="monitor-svg">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                    </div>
                    <span className="appearance-label">System</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="onboarding-actions">
              <button className="onboarding-back-btn" onClick={() => setStep(1)}>Back to Teams</button>
              <button className="onboarding-finish-btn" onClick={() => setStep(3)}>Continue</button>
            </div>
          </>
        ) : (
          <>
            <div className="onboarding-header">
              <h2 className="step-title">CUSTOMIZE YOUR PIT WALL</h2>
              <p>Toggle the widgets you'd like to see on your primary dashboard.</p>
            </div>

            <div className="widget-selection-area">
              <div className="onboarding-widget-grid">
                {Object.entries(WIDGET_LABELS).map(([key, label]) => (
                  <label key={key} className="onboarding-widget-card">
                    <input 
                      type="checkbox" 
                      checked={preferences.widgets?.[key] !== false}
                      onChange={() => handleWidgetToggle(key)}
                    />
                    <div className="widget-card-content">
                      <span className="widget-check"></span>
                      <span className="widget-label">{label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="onboarding-actions">
              <button className="onboarding-back-btn" onClick={() => setStep(2)}>Back</button>
              <button className="onboarding-finish-btn" onClick={finalizeOnboarding}>Initialize Dashboard</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OnboardingModal
