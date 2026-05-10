import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
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
    throw new Error(error.message || 'Failed to sign in with Google')
  }
}

export const signUpWithEmail = async (email, password, name) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    // Update the profile with the display name
    await updateProfile(result.user, { displayName: name })
    
    return {
      uid: result.user.uid,
      name: name,
      email: result.user.email,
      picture: null
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to create account')
  }
}

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return {
      uid: result.user.uid,
      name: result.user.displayName,
      email: result.user.email,
      picture: result.user.photoURL
    }
  } catch (error) {
    throw new Error(error.message || 'Invalid email or password')
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
