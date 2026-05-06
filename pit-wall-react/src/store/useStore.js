import { create } from 'zustand'

const useStore = create((set) => ({
  authReady: false,
  user: null,
  preferences: { 
    team: "ferrari", 
    theme: "dark",
    widgets: {
      news: true,
      standings: true,
      podium: true,
      stats: true,
      calendar: true
    }
  },
  heroStats: [],
  ticker: [],
  calendar: {
    meta: "22 Rounds · Mar → Dec 2026",
    progress: "13.6%",
    rounds: []
  },
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
  setRace: (race) => set({ race }),
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
