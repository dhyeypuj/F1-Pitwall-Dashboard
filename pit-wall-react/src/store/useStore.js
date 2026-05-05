import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  preferences: { team: "ferrari", theme: "dark" },
  race: {
    nextRace: {
      round: "Round 04",
      status: "Up Next",
      flag: "🇺🇸",
      city: "Miami",
      title: "Grand Prix",
      circuit: "Miami International Autodrome",
      location: "Hard Rock Stadium",
      details: "Round 4 of 23 · 57 laps · 308.326 km",
      stats: [
        { label: "Lap Record", value: "1:29.708" },
        { label: "Pole 2025", value: "M. Verstappen" },
        { label: "Dates", value: "May 1 – 3" }
      ]
    },
    countdown: {
      targetDate: "2026-05-03T20:00:00Z"
    }
  },
  standings: {
    drivers: [
      { pos: "01", name: "K. Antonelli", code: "ANT", team: "Mercedes", nationality: "ITA", points: 72, gap: null, color: "var(--mercedes)", codeBg: "var(--mercedes)", codeColor: "#000" },
      { pos: "02", name: "G. Russell", code: "RUS", team: "Mercedes", nationality: "GBR", points: 63, gap: "−9", color: "var(--mercedes)", codeBg: "var(--mercedes)", codeColor: "#000" },
      { pos: "03", name: "C. Leclerc", code: "LEC", team: "Ferrari", nationality: "MON", points: 49, gap: "−23", color: "var(--ferrari)" },
      { pos: "04", name: "L. Hamilton", code: "HAM", team: "Ferrari", nationality: "GBR", points: 41, gap: "−31", color: "var(--ferrari)" },
      { pos: "05", name: "L. Norris", code: "NOR", team: "McLaren", nationality: "GBR", points: 25, gap: "−47", color: "var(--mclaren)" },
      { pos: "06", name: "O. Piastri", code: "PIA", team: "McLaren", nationality: "AUS", points: 21, gap: "−51", color: "var(--mclaren)" },
      { pos: "07", name: "O. Bearman", code: "BEA", team: "Haas", nationality: "GBR", points: 17, gap: "−55", color: "var(--haas)", codeBg: "#4a4a4a" },
      { pos: "08", name: "P. Gasly", code: "GAS", team: "Alpine", nationality: "FRA", points: 15, gap: "−57", color: "var(--alpine)" },
      { pos: "09", name: "M. Verstappen", code: "VER", team: "Red Bull", nationality: "NED", points: 12, gap: "−60", color: "var(--redbull)" },
      { pos: "10", name: "L. Lawson", code: "LAW", team: "Racing Bulls", nationality: "NZL", points: 10, gap: "−62", color: "var(--racingbulls)" }
    ],
    constructors: [
      { pos: "01", name: "Mercedes-AMG", engine: "Mercedes PU", nationality: "DEU", points: 135, width: "100%", color: "var(--mercedes)" },
      { pos: "02", name: "Scuderia Ferrari", engine: "Ferrari PU", nationality: "ITA", points: 90, width: "66%", color: "var(--ferrari)" },
      { pos: "03", name: "McLaren", engine: "Mercedes PU", nationality: "GBR", points: 46, width: "34%", color: "var(--mclaren)" },
      { pos: "04", name: "Haas F1", engine: "Ferrari PU", nationality: "USA", points: 18, width: "13%", color: "var(--haas)" },
      { pos: "05", name: "Red Bull Racing", engine: "Red Bull Ford", nationality: "AUT", points: 16, width: "12%", color: "var(--redbull)" },
      { pos: "06", name: "Alpine", engine: "Mercedes PU", nationality: "FRA", points: 16, width: "12%", color: "var(--alpine)" },
      { pos: "07", name: "Racing Bulls", engine: "Red Bull Ford", nationality: "ITA", points: 14, width: "10%", color: "var(--racingbulls)" },
      { pos: "08", name: "Audi", engine: "Audi PU", nationality: "DEU", points: 2, width: "2%", color: "var(--audi)" },
      { pos: "09", name: "Williams", engine: "Mercedes PU", nationality: "GBR", points: 2, width: "2%", color: "var(--williams)" },
      { pos: "10", name: "Aston Martin", engine: "Honda PU", nationality: "GBR", points: 0, width: "0%", color: "var(--aston)" },
      { pos: "11", name: "Cadillac", engine: "Ferrari PU · USA · NEW", nationality: "USA", points: 0, width: "0%", color: "var(--cadillac)" }
    ]
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

  setUser: (user) => set({ user }),
  setPreferences: (preferences) => set({ preferences }),
  setRace: (race) => set({ race }),
  setStandings: (standings) => set({ standings }),
  setNews: (news) => set({ news }),
}))

export default useStore
