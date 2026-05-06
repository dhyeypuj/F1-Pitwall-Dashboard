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
  try {
    const userRef = doc(db, USERS_COLLECTION, uid)
    const snapshot = await getDoc(userRef)

    if (snapshot.exists()) {
      const data = snapshot.data()
      return {
        favoriteTeam: data.favoriteTeam || 'ferrari',
        theme: data.theme || 'dark'
      }
    }

    return { favoriteTeam: 'ferrari', theme: 'dark' }
  } catch (error) {
    console.error('Failed to fetch user preferences:', error)
    return { favoriteTeam: 'ferrari', theme: 'dark' }
  }
}

/**
 * Update specific user preferences in Firestore.
 */
export const updateUserPreferences = async (uid, preferences) => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid)
    await setDoc(userRef, {
      ...preferences,
      updatedAt: serverTimestamp()
    }, { merge: true })
  } catch (error) {
    console.error('Failed to update user preferences:', error)
  }
}
