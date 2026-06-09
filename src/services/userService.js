import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

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
    console.error('Failed to save user to Firestore:', error)
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
    appearance: 'light',
    widgets: {
      news: true,
      standings: true,
      podium: true,
      stats: true,
      calendar: true
    }
  }

  // 1. Try local storage cache first
  try {
    const cached = localStorage.getItem(`f1_prefs_${uid}`)
    if (cached) {
      const parsed = JSON.parse(cached)
      return {
        ...defaults,
        ...parsed
      }
    }
  } catch (err) {
    console.warn('Failed to parse cached user preferences:', err)
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, uid)
    const snapshot = await getDoc(userRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      const prefs = {
        team: data.team || data.favoriteTeam || defaults.team,
        theme: data.theme || defaults.theme,
        appearance: data.appearance || defaults.appearance,
        hasSelectedTeam: data.hasSelectedTeam !== undefined ? !!data.hasSelectedTeam : false,
        widgets: {
          ...defaults.widgets,
          ...(data.widgets || {})
        }
      }
      
      // Save cache
      try {
        localStorage.setItem(`f1_prefs_${uid}`, JSON.stringify(prefs))
      } catch (e) {}
      
      return prefs
    }

    return { ...defaults, hasSelectedTeam: false }
  } catch (error) {
    console.error('Failed to fetch user preferences from Firestore:', error)
    
    // 2. Return local storage or default if Firestore fails
    try {
      const cached = localStorage.getItem(`f1_prefs_${uid}`)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch (e) {}

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
    console.warn('Failed to cache preferences in localStorage:', err)
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, uid)
    await setDoc(userRef, {
      ...preferences,
      updatedAt: serverTimestamp()
    }, { merge: true })
  } catch (error) {
    console.error('Failed to update user preferences in Firestore:', error)
  }
}
