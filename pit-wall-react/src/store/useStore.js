import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  preferences: { team: "ferrari", theme: "dark" },
  race: { nextRace: {}, countdown: {} },
  standings: { drivers: [], constructors: [] },
  news: [],

  setUser: (user) => set({ user }),
  setPreferences: (preferences) => set({ preferences }),
  setRace: (race) => set({ race }),
  setStandings: (standings) => set({ standings }),
  setNews: (news) => set({ news }),
}))

export default useStore
