import { create } from 'zustand'
import { getActiveSeasonSync } from '../services/seasonService'

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
