import { create } from 'zustand'
import { getActiveSeasonSync } from '../services/seasonService'
import { getLatestOpenF1Session, getOpenF1RaceControl } from '../services/sessionService'

const initialSeason = getActiveSeasonSync()

const useStore = create((set) => ({
  activeSeason: initialSeason,
  setActiveSeason: (activeSeason) => set({ activeSeason }),
  authReady: false,
  user: null,
  preferences: {
    team: "ferrari",
    theme: "dark",
    appearance: "system",
    hasSelectedTeam: true, // Default to true so it doesn't flash for guests, but will be set by App.jsx from Firebase
    widgets: {
      news: true,
      standings: true,
      podium: true,
      stats: true,
      calendar: true
    }
  },
  isSettingsOpen: false,
  toggleSettings: () => set((state) => ({ isSettingsOpen: !state.isSettingsOpen })),
  updatePreference: (key, value) => set((state) => {
    const newPrefs = {
      ...state.preferences,
      [key]: value
    };
    if (key === 'appearance') {
      if (value === 'dark' || value === 'light') {
        newPrefs.theme = value;
      } else if (value === 'system') {
        const systemIsDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        newPrefs.theme = systemIsDark ? 'dark' : 'light';
      }
    }
    return { preferences: newPrefs };
  }),
  heroStats: [],
  ticker: [],
  calendar: {
    meta: `Rounds · ${initialSeason}`,
    progress: "0%",
    rounds: []
  },
  sessions: [],
  isLoadingSessions: false,
  isLoadingStandings: true,
  isLoadingRace: true,
  isLoadingCalendar: true,
  isLoadingResults: true,
  isLoadingStats: true,
  isLoadingNews: true,
  errorStandings: null,
  errorRace: null,
  errorCalendar: null,
  errorResults: null,
  errorStats: null,
  errorNews: null,
  setSessions: (sessions) => set({ sessions }),
  setLoading: (key, value) => set({ [key]: value }),
  setError: (key, value) => set({ [key]: value }),
  podium: {
    title: "",
    results: []
  },
  raceStats: null,
  footerNote: "For you · eyes only",
  race: {
    nextRace: null,
    countdown: { targetDate: null }
  },
  standings: {
    drivers: [],
    constructors: []
  },
  news: [],
  stats: [],
  
  // Live Commentary State
  currentPage: 'dashboard',
  commentaryTab: 'news',
  liveCommentary: [],
  commentaryError: null,
  commentaryMode: 'demo',
  isLoadingCommentary: false,
  showAlert: false,
  setCurrentPage: (currentPage) => set({ currentPage }),
  setCommentaryTab: (commentaryTab) => set({ commentaryTab }),
  setCommentaryMode: (commentaryMode) => set({ commentaryMode }),
  setShowAlert: (showAlert) => set({ showAlert }),
  
  fetchCommentaryFeed: async (force = false) => {
    const state = useStore.getState()
    
    // 1. Determine if a session is live/recently active according to local Ergast schedule
    const now = new Date()
    let isLiveScheduled = false
    
    if (state.sessions && state.sessions.length > 0) {
      for (const weekend of state.sessions) {
        for (const [key, s] of Object.entries(weekend.sessions || {})) {
          const start = new Date(s.start)
          const end = new Date(s.end)
          const isRace = key === 'race' || s.name.toLowerCase() === 'race'
          const gracePeriodMs = isRace ? 3 * 60 * 60 * 1000 : 0
          const endWithGrace = new Date(end.getTime() + gracePeriodMs)
          
          if (now >= start && now <= endWithGrace) {
            isLiveScheduled = true
            break
          }
        }
        if (isLiveScheduled) break
      }
    }
    
    // If we aren't live scheduled, and we aren't forcing, set demo mode immediately
    if (!isLiveScheduled && !force) {
      set({ 
        liveCommentary: [], 
        commentaryMode: 'demo', 
        commentaryError: null,
        isLoadingCommentary: false
      })
      return
    }
    
    // Otherwise, try to fetch from OpenF1
    set({ isLoadingCommentary: true, commentaryError: null })
    try {
      const openF1Session = await getLatestOpenF1Session()
      
      if (!openF1Session) {
        throw new Error('No active OpenF1 session found.')
      }
      
      if (openF1Session.error === 'unauthorized') {
        set({ 
          liveCommentary: [], 
          commentaryMode: 'demo',
          commentaryError: 'OpenF1 restricted access (Live F1 session in progress).',
          isLoadingCommentary: false
        })
        return
      }
      
      const messages = await getOpenF1RaceControl(openF1Session.session_key)
      
      if (messages.error === 'unauthorized') {
        set({ 
          liveCommentary: [], 
          commentaryMode: 'demo',
          commentaryError: 'OpenF1 restricted access (Live F1 session in progress).',
          isLoadingCommentary: false
        })
        return
      }
      
      set({
        liveCommentary: messages,
        commentaryMode: 'live',
        commentaryError: messages.length === 0 ? 'No race control messages for this session yet.' : null,
        isLoadingCommentary: false
      })
    } catch (err) {
      console.error('Failed to fetch live commentary:', err)
      set({
        liveCommentary: [],
        commentaryMode: 'demo',
        commentaryError: `Failed to connect to OpenF1: ${err.message}.`,
        isLoadingCommentary: false
      })
    }
  },

  setAuthReady: (authReady) => set({ authReady }),
  setUser: (user) => set({ user }),
  setPreferences: (preferences) => set({ preferences }),
  setRace: (nextRace) => set((state) => ({ race: { ...state.race, nextRace } })),
  setStandings: (standings) => set({ standings }),
  setNews: (news) => set({ news }),
  setCalendar: (calendar) => set({ calendar }),
  setHeroStats: (heroStats) => set({ heroStats }),
  setTicker: (ticker) => set({ ticker }),
  setPodium: (podium) => set({ podium }),
  setStats: (stats) => set({ stats }),
  setRaceStats: (raceStats) => set({ raceStats }),
}))

export const getTopDriver = (state) => state.standings.drivers?.[0]
export const getNextRaceName = (state) => state.race.nextRace ? `${state.race.nextRace.city || ''} ${state.race.nextRace.title || ''}`.trim() : 'TBD'
export const getTeamTheme = (state) => state.preferences.team
export const getIsAuthenticated = (state) => !!state.user

export default useStore
