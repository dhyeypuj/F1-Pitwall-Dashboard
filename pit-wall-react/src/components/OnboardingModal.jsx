import React from 'react'
import useStore from '../store/useStore'
import { TEAMS } from './SettingsPanel'
import { updateUserPreferences } from '../services/userService'

const OnboardingModal = () => {
  const user = useStore(state => state.user)
  const preferences = useStore(state => state.preferences)
  const updatePreference = useStore(state => state.updatePreference)

  // Only show if user is authenticated but hasn't explicitly selected a team yet
  if (!user || preferences.hasSelectedTeam) return null

  const handleTeamSelect = async (teamId) => {
    // 1. Update store immediately (this also sets hasSelectedTeam: true)
    updatePreference('team', teamId)
    
    // 2. Sync with Firestore
    if (user?.uid) {
      try {
        await updateUserPreferences(user.uid, { ...preferences, team: teamId, hasSelectedTeam: true })
      } catch (err) {
        console.error('Failed to sync onboarding preference:', err)
      }
    }
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <div className="checker-flag large"></div>
          <h1>WELCOME TO THE PIT WALL</h1>
          <p>Choose your allegiance to personalize your dashboard theme and news feed.</p>
        </div>

        <div className="team-selection-area">
          <label className="selection-label">SELECT YOUR TEAM</label>
          <div className="onboarding-team-grid">
            {TEAMS.map(team => (
              <button 
                key={team.id}
                className="onboarding-team-btn"
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

        <div className="onboarding-footer">
          <p>You can change this anytime in the settings panel.</p>
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal
