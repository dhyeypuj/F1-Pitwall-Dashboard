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
    rounds: [
      { id: "R01", num: "R01", status: "CANC", emoji: "🇦🇺", country: "Australia", name: "Albert Park", date: "Mar 06–08", winner: "G. Russell", done: true },
      { id: "R02", num: "R02", status: "", emoji: "🇨🇳", country: "China", name: "Shanghai", date: "Mar 13–15", winner: "K. Antonelli", done: true },
      { id: "R03", num: "R03", status: "", emoji: "🇯🇵", country: "Japan", name: "Suzuka", date: "Mar 27–29", winner: "K. Antonelli", done: true },
      { id: "R04", num: "R04 · NEXT", status: "", emoji: "🇺🇸", country: "USA", name: "Miami", date: "May 01–03", winner: "", next: true },
      { id: "R05", num: "R05", status: "", emoji: "🇨🇦", country: "Canada", name: "Montreal", date: "May 22–24", winner: "" },
      { id: "R06", num: "R06", status: "", emoji: "🇲🇨", country: "Monaco", name: "Monte Carlo", date: "Jun 05–07", winner: "" },
      { id: "R07", num: "R07", status: "", emoji: "🇪🇸", country: "Spain", name: "Barcelona", date: "Jun 12–14", winner: "" },
      { id: "R08", num: "R08", status: "", emoji: "🇦🇹", country: "Austria", name: "Red Bull Ring", date: "Jun 26–28", winner: "" },
      { id: "R09", num: "R09", status: "", emoji: "🇬🇧", country: "UK", name: "Silverstone", date: "Jul 03–05", winner: "" },
      { id: "R10", num: "R10", status: "", emoji: "🇧🇪", country: "Belgium", name: "Spa", date: "Jul 24–26", winner: "" },
      { id: "R11", num: "R11", status: "", emoji: "🇭🇺", country: "Hungary", name: "Hungaroring", date: "Jul 31–Aug 2", winner: "" },
      { id: "R12", num: "R12", status: "", emoji: "🇳🇱", country: "Netherlands", name: "Zandvoort", date: "Aug 21–23", winner: "" },
      { id: "R13", num: "R13", status: "", emoji: "🇮🇹", country: "Italy", name: "Monza", date: "Sep 04–06", winner: "" },
      { id: "R14", num: "R14", status: "", emoji: "🇪🇸", country: "Spain", name: "Madrid", date: "Sep 11–13", winner: "" },
      { id: "R15", num: "R15", status: "", emoji: "🇦🇿", country: "Azerbaijan", name: "Baku", date: "Sep 26 · Sat", winner: "" },
      { id: "R16", num: "R16", status: "", emoji: "🇸🇬", country: "Singapore", name: "Marina Bay", date: "Oct 09–11", winner: "" },
      { id: "R17", num: "R17", status: "", emoji: "🇺🇸", country: "USA", name: "Austin", date: "Oct 23–25", winner: "" },
      { id: "R18", num: "R18", status: "", emoji: "🇲🇽", country: "Mexico", name: "Mexico City", date: "Oct 30–Nov 1", winner: "" },
      { id: "R19", num: "R19", status: "", emoji: "🇧🇷", country: "Brazil", name: "São Paulo", date: "Nov 06–08", winner: "" },
      { id: "R20", num: "R20", status: "", emoji: "🇺🇸", country: "USA", name: "Las Vegas", date: "Nov 19–21", winner: "" },
      { id: "R21", num: "R21", status: "", emoji: "🇶🇦", country: "Qatar", name: "Lusail", date: "Nov 27–29", winner: "" },
      { id: "R22", num: "R22", status: "", emoji: "🇦🇪", country: "UAE", name: "Yas Marina", date: "Dec 04–06", winner: "" }
    ]
  },
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
}))

export const getTopDriver = (state) => state.standings.drivers[0]
export const getNextRaceName = (state) => `${state.race.nextRace.city} ${state.race.nextRace.title}`
export const getTeamTheme = (state) => state.preferences.team

export default useStore
