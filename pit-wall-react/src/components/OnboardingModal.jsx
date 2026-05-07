import React, { useState } from 'react'
import useStore from '../store/useStore'
import { TEAMS } from './SettingsPanel'

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
              <button className="onboarding-back-btn" onClick={() => setStep(1)}>Back to Teams</button>
              <button className="onboarding-finish-btn" onClick={finalizeOnboarding}>Initialize Dashboard</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default OnboardingModal
