import { create } from 'zustand'

const useStore = create((set) => ({
  user: {
    name: "Shreya",
    greeting: "Good morning, Shreya",
    date: "SUN · 03 MAY · 2026"
  },
  preferences: { team: "ferrari", theme: "dark" },
  heroStats: [
    { val: "Antonelli", lbl: "Championship Lead" },
    { val: "Mercedes", lbl: "Constructors' Cup" },
    { val: "23", lbl: "Rounds" }
  ],
  ticker: [
    { sym: 'WDC', val: 'ANTONELLI', pts: '72 pts' },
    { sym: 'WCC', val: 'MERCEDES', pts: '135 pts' },
    { sym: 'NEXT', val: 'MIAMI GP', pts: 'MAY 3' },
    { sym: 'WINNER', val: 'ANTONELLI', pts: 'JAPAN' },
    { sym: 'FL', val: 'RUSSELL', pts: '1:28.411' },
    { sym: 'FAST PIT', val: 'MCLAREN', pts: '1.94s' },
    { sym: 'VER', val: '−60', pts: 'P9' },
    { sym: 'ROOKIE', val: 'LINDBLAD', pts: '4 pts' }
  ],
  calendar: {
    meta: "23 Rounds · Mar → Dec 2026",
    progress: "13.6%",
    rounds: []
  },
  isLoadingStandings: true,
  isLoadingRace: true,
  isLoadingCalendar: true,
  setLoading: (key, value) => set({ [key]: value }),
  podium: {
    title: "Japanese GP · Suzuka · Result",
    results: [
      { id: "p1", cls: "p1", badge: "P1", name: "Kimi Antonelli", team: "Mercedes · #12", time: "1:28:14.802" },
      { id: "p2", cls: "p2", badge: "P2", name: "George Russell", team: "Mercedes · #63", time: "+3.441" },
      { id: "p3", cls: "p3", badge: "P3", name: "Charles Leclerc", team: "Ferrari · #16", time: "+9.127" }
    ]
  },
  footerNote: "For Shreya · eyes only",
  race: {
    nextRace: null,
    countdown: { targetDate: null }
  },
  standings: {
    drivers: [],
    constructors: []
  },
  news: [
    {
      id: "01",
      type: "lead",
      kicker: "The Story",
      headline: "Antonelli's rookie surge rewrites Mercedes' championship math",
      body: "Three rounds in, the 19-year-old Italian has back-to-back wins and sits atop the drivers' table. Wolff has already shifted team orders mid-weekend. Russell now races his own teammate for the title."
    },
    {
      id: "02",
      type: "neutral",
      kicker: "Engine Wars",
      headline: "Red Bull's new PU is down 15hp to Mercedes, paddock sources say",
      body: "Despite the full Ford works programme, Red Bull's 2026 power unit appears weakest on the grid. Verstappen's P5 in Japan came from chassis, not pace."
    },
    {
      id: "03",
      type: "neutral",
      kicker: "Debut",
      headline: "Cadillac goal is simple: finish races, learn fast, build for 2029",
      body: "GM's eleventh team runs Ferrari PUs until its in-house unit is ready. Herta confirmed for four FP1 outings this year."
    },
    {
      id: "04",
      type: "",
      kicker: "Calendar",
      headline: "FIA confirms Bahrain and Saudi cancellations, no replacements",
      body: "Iran war fallout leaves the season at 23 rounds, Australia to Abu Dhabi. Feeder series affected too."
    }
  ],
  stats: [
    { id: 1, label: "Championship Lead", bigHtml: "<em>+9</em> pts", sub: "Antonelli over Russell" },
    { id: 2, label: "Fastest Lap 2026", bigHtml: "1:28.411", sub: "Russell · Japan Q3" },
    { id: 3, label: "Fastest Pit Stop", bigHtml: "1.94<em>s</em>", sub: "McLaren · Japanese GP" },
    { id: 4, label: "Verstappen Gap", bigHtml: "P9 <em>·</em> −60", sub: "Worst start since 2017" }
  ],

  setUser: (user) => set({ user }),
  setPreferences: (preferences) => set({ preferences }),
  setRace: (race) => set({ race }),
  setStandings: (standings) => set({ standings }),
  setNews: (news) => set({ news }),
  setCalendar: (calendar) => set({ calendar }),
}))

export const getTopDriver = (state) => state.standings.drivers?.[0]
export const getNextRaceName = (state) => state.race.nextRace ? `${state.race.nextRace.city || ''} ${state.race.nextRace.title || ''}`.trim() : 'TBD'
export const getTeamTheme = (state) => state.preferences.team

export default useStore
