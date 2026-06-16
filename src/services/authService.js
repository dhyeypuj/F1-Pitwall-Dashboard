import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { logger } from './logger'

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user

    logger.info(`Google Sign-In successful for uid: ${user.uid}`)

    return {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      picture: user.photoURL
    }
  } catch (error) {
    logger.error('Google Sign-In failed', error)
    throw new Error(error.message || 'Failed to sign in with Google', { cause: error })
  }
}

export const signUpWithEmail = async (email, password, name) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    // Update the profile with the display name
    await updateProfile(result.user, { displayName: name })
    
    logger.info(`Email account creation successful for uid: ${result.user.uid}`)

    return {
      uid: result.user.uid,
      name: name,
      email: result.user.email,
      picture: null
    }
  } catch (error) {
    logger.error('Sign-up with email failed', error)
    throw new Error(error.message || 'Failed to create account', { cause: error })
  }
}

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    
    logger.info(`Email login successful for uid: ${result.user.uid}`)

    return {
      uid: result.user.uid,
      name: result.user.displayName,
      email: result.user.email,
      picture: result.user.photoURL
    }
  } catch (error) {
    logger.error('Sign-in with email failed', error)
    throw new Error(error.message || 'Invalid email or password', { cause: error })
  }
}

export const logout = async () => {
  try {
    await signOut(auth)
    logger.info('Sign-out succeeded')
  } catch (error) {
    logger.error('Sign-out failed', error)
    throw new Error('Failed to sign out', { cause: error })
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

