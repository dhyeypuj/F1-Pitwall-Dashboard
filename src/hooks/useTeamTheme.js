import { useEffect, useCallback } from 'react'
import useStore from '../store/useStore'
import { updateUserPreferences } from '../services/userService'
import { TEAMS, DEFAULT_TEAM } from '../config/themes'

/**
 * Custom hook to manage the active F1 team theme.
 * Handles DOM application, state syncing, and persistence.
 */
export const useTeamTheme = () => {
  const user = useStore((state) => state.user)
  const team = useStore((state) => state.preferences.team)
  const setPreferences = useStore((state) => state.setPreferences)

  // Apply theme to the root element whenever it changes
  useEffect(() => {
    const activeTeam = Object.values(TEAMS).includes(team) ? team : DEFAULT_TEAM
    document.documentElement.setAttribute('data-team', activeTeam)
  }, [team])

  /**
   * Update the team theme globally and persist to Firestore
   */
  const changeTeam = useCallback(async (newTeam) => {
    if (!Object.values(TEAMS).includes(newTeam)) return

    // 1. Update local state for instant feedback
    setPreferences({ team: newTeam })

    // 2. Persist to Firestore if user is authenticated
    if (user?.uid) {
      try {
        await updateUserPreferences(user.uid, { favoriteTeam: newTeam })
      } catch (error) {
        console.error('Failed to persist team preference:', error)
      }
    }
  }, [user, setPreferences])

  return {
    activeTeam: team,
    changeTeam,
    availableTeams: TEAMS
  }
}
