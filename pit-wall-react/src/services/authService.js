import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth, googleProvider } from './firebase'

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      picture: user.photoURL
    }
  } catch (error) {
    console.error('Google sign-in failed:', error)
    throw new Error('Failed to sign in with Google')
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error('Sign-out failed:', error)
    throw new Error('Failed to sign out')
  }
}

export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      callback({
        uid: user.uid,
        name: user.displayName,
        email: user.email,
        picture: user.photoURL
      })
    } else {
      callback(null)
    }
  })
}
