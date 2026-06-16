import { useState, useRef } from 'react'
import { signInWithGoogle, signInWithEmail, signUpWithEmail } from '../services/authService'
import useStore from '../store/useStore'
import { getActiveSeasonSync } from '../services/seasonService'
import { analytics } from '../services/analytics'

const AuthPage = () => {
  const setUser = useStore((state) => state.setUser)
  const preferences = useStore((state) => state.preferences)
  const updatePreference = useStore((state) => state.updatePreference)
  
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const activeAppearance = preferences?.appearance || 'system'
  const isDark = activeAppearance === 'dark' || 
    (activeAppearance === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  const toggleTheme = () => {
    const nextAppearance = isDark ? 'light' : 'dark'
    analytics.trackAppearanceChange(activeAppearance, nextAppearance)
    updatePreference('appearance', nextAppearance)
    
    // Save to guest preferences in localStorage so it persists on reload
    try {
      const guestPrefs = {
        ...preferences,
        appearance: nextAppearance,
        theme: nextAppearance
      }
      localStorage.setItem('f1_prefs_guest', JSON.stringify(guestPrefs))
    } catch (e) {
      console.error('Failed to save guest theme:', e)
    }
  }
  
  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const isProcessing = useRef(false)

  const normalizeUser = (firebaseUser) => {
    const hour = new Date().getHours()
    const timeGreeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
    const rawFirstName = (firebaseUser.name || 'Fan').split(' ')[0]
    const firstName = rawFirstName.charAt(0).toUpperCase() + rawFirstName.slice(1)

    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).toUpperCase().replace(/,/g, ' ·')

    return {
      uid: firebaseUser.uid,
      name: firstName,
      email: firebaseUser.email,
      picture: firebaseUser.picture,
      greeting: `${timeGreeting}, ${firstName}`,
      date: dateStr
    }
  }

  const handleGoogleSignIn = async () => {
    if (isProcessing.current) return
    isProcessing.current = true
    setIsLoading(true)
    setError(null)

    try {
      const firebaseUser = await signInWithGoogle()
      setUser(normalizeUser(firebaseUser))
      analytics.trackLogin('google')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
      isProcessing.current = false
    }
  }

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    if (isProcessing.current) return
    isProcessing.current = true
    setIsLoading(true)
    setError(null)

    try {
      let firebaseUser
      if (isLogin) {
        firebaseUser = await signInWithEmail(email, password)
        analytics.trackLogin('email')
      } else {
        if (!name) throw new Error('Please enter your name')
        firebaseUser = await signUpWithEmail(email, password, name)
        analytics.trackLogin('email_signup')
      }
      setUser(normalizeUser(firebaseUser))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
      isProcessing.current = false
    }
  }

  return (
    <div className="auth-page">
      <button 
        type="button" 
        className="auth-theme-toggle" 
        onClick={toggleTheme}
        aria-label="Toggle theme mode"
      >
        <div className={`theme-toggle-icon-wrapper ${isDark ? 'dark' : 'light'}`}>
          <div className="sun-icon-svg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </div>
          <div className="moon-icon-svg">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          </div>
        </div>
      </button>

      <span className="auth-speed-line"></span>
      <span className="auth-speed-line"></span>
      <span className="auth-speed-line"></span>

      <div className="auth-card">
        <div className="auth-accent"></div>

        <div className="auth-eyebrow">
          <span className="checker-flag"></span>
          <span>Personal Edition · F1 {getActiveSeasonSync()}</span>
        </div>

        <h1 className="auth-title">
          <span className="auth-line1"><span>The</span></span>
          <span className="auth-line2"><span>Pit Wall.</span></span>
        </h1>

        <div className="auth-underline"></div>

        {error && (
          <div className="auth-error">
            <span className="auth-error-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}

        <form className="auth-form" onSubmit={handleEmailAuth}>
          {!isLogin && (
            <div className="auth-input-group">
              <label>Name</label>
              <input 
                type="text" 
                placeholder="Driver Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          )}
          <div className="auth-input-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="paddock@intel.f1" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="auth-input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit" 
            className="auth-main-btn" 
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-loading">
                <span className="auth-spinner"></span>
                Processing…
              </span>
            ) : (
              isLogin ? 'Access Dashboard' : 'Create Account'
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          className="auth-google-btn"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          type="button"
        >
          <svg className="auth-google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google
        </button>

        <div className="auth-mode-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button type="button" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </div>

        <div className="auth-footer-tag">
          <span className="auth-dot"></span>
          Lights out and away we go
        </div>
      </div>

      <div className="auth-attribution">
        Built with passion for every F1 fan
      </div>
    </div>
  )
}

export default AuthPage
