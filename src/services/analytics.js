import { track } from '@vercel/analytics'

export const analytics = {
  trackLogin: (method) => {
    track('login_success', { method })
  },
  
  trackLogout: () => {
    track('logout')
  },
  
  trackOnboardingComplete: (team, theme) => {
    track('onboarding_complete', { team, theme })
  },
  
  trackTeamChange: (oldTeam, newTeam) => {
    track('team_change', { from: oldTeam, to: newTeam })
  },
  
  trackAppearanceChange: (oldAppearance, newAppearance) => {
    track('appearance_change', { from: oldAppearance, to: newAppearance })
  },
  
  trackWidgetToggle: (widgetId, isVisible) => {
    track('widget_visibility_toggle', { widgetId, isVisible: String(isVisible) })
  }
}
