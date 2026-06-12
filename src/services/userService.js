import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'
import { logger } from './logger'

const USERS_COLLECTION = 'users'

/**
 * Create or update a user document in Firestore.
 * Uses merge to preserve existing fields (e.g. favoriteTeam set later).
 */
export const saveUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, user.uid)
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.name || 'F1 Fan',
      email: user.email || '',
      photoURL: user.picture || null,
      lastLogin: serverTimestamp()
    }, { merge: true })
  } catch (error) {
    logger.error('Failed to save user to Firestore', error)
  }
}

/**
 * Fetch user preferences from Firestore.
 * Returns stored preferences or defaults if document doesn't exist.
 */
export const getUserPreferences = async (uid) => {
  const defaults = {
    team: 'ferrari',
    theme: 'dark',
    appearance: 'system',
    widgets: {
      news: true,
      standings: true,
      podium: true,
      stats: true,
      calendar: true
    }
  }

  const getCachedPreferences = () => {
    try {
      const cached = localStorage.getItem(`f1_prefs_${uid}`)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (e) {}
    return null
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, uid)
    const snapshot = await getDoc(userRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      const appearance = data.appearance || data.theme || defaults.appearance
      let theme = data.theme || defaults.theme
      if (appearance === 'system') {
        const systemIsDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        theme = systemIsDark ? 'dark' : 'light'
      } else {
        theme = appearance
      }

      const prefs = {
        team: data.team || data.favoriteTeam || defaults.team,
        theme,
        appearance,
        hasSelectedTeam: data.hasSelectedTeam !== undefined ? !!data.hasSelectedTeam : false,
        widgets: {
          ...defaults.widgets,
          ...(data.widgets || {})
        }
      }
      
      // Update local storage cache
      try {
        localStorage.setItem(`f1_prefs_${uid}`, JSON.stringify(prefs))
      } catch (e) {}
      
      return prefs
    }

    // Document doesn't exist yet, return defaults
    return { ...defaults, hasSelectedTeam: false }
  } catch (error) {
    logger.error('Failed to fetch user preferences from Firestore, falling back to cache', error)
    
    // Fallback to cache if database fetch fails (e.g. offline)
    const cached = getCachedPreferences()
    if (cached) {
      const appearance = cached.appearance || cached.theme || defaults.appearance
      let theme = cached.theme || defaults.theme
      if (appearance === 'system') {
        const systemIsDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        theme = systemIsDark ? 'dark' : 'light'
      } else {
        theme = appearance
      }

      return {
        ...defaults,
        ...cached,
        theme,
        appearance
      }
    }

    return { ...defaults, hasSelectedTeam: false }
  }
}

/**
 * Update specific user preferences in Firestore.
 */
export const updateUserPreferences = async (uid, preferences) => {
  try {
    // 1. Write to localStorage cache first
    localStorage.setItem(`f1_prefs_${uid}`, JSON.stringify(preferences))
  } catch (err) {
    logger.warn('Failed to cache preferences in localStorage', err)
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, uid)
    await setDoc(userRef, {
      ...preferences,
      updatedAt: serverTimestamp()
    }, { merge: true })
  } catch (error) {
    logger.error('Failed to update user preferences in Firestore', error)
  }
}
