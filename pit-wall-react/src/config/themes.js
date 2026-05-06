/**
 * Centralized F1 Team Configuration for 2026 Season
 */
export const TEAMS = {
  FERRARI: 'ferrari',
  MERCEDES: 'mercedes',
  REDBULL: 'redbull',
  MCLAREN: 'mclaren',
  ASTONMARTIN: 'astonmartin',
  WILLIAMS: 'williams',
  ALPINE: 'alpine',
  HAAS: 'haas',
  RACINGBULLS: 'racingbulls',
  AUDI: 'audi',
  CADILLAC: 'cadillac',
}

export const TEAM_METADATA = {
  [TEAMS.FERRARI]: {
    name: 'Scuderia Ferrari HP',
    primaryColor: '#E10600',
    location: 'Maranello, Italy'
  },
  [TEAMS.MERCEDES]: {
    name: 'Mercedes-AMG PETRONAS F1',
    primaryColor: '#00A19B',
    location: 'Brackley, UK'
  },
  [TEAMS.REDBULL]: {
    name: 'Oracle Red Bull Racing',
    primaryColor: '#0600EF',
    location: 'Milton Keynes, UK'
  },
  [TEAMS.MCLAREN]: {
    name: 'McLaren Formula 1 Team',
    primaryColor: '#FF8700',
    location: 'Woking, UK'
  },
  [TEAMS.ASTONMARTIN]: {
    name: 'Aston Martin Aramco F1 Team',
    primaryColor: '#006F62',
    location: 'Silverstone, UK'
  },
  [TEAMS.ALPINE]: {
    name: 'BWT Alpine F1 Team',
    primaryColor: '#0090FF',
    location: 'Enstone, UK'
  },
  [TEAMS.WILLIAMS]: {
    name: 'Williams Racing',
    primaryColor: '#005AFF',
    location: 'Grove, UK'
  },
  [TEAMS.HAAS]: {
    name: 'MoneyGram Haas F1 Team',
    primaryColor: '#E6002B',
    location: 'Kannapolis, USA'
  },
  [TEAMS.RACINGBULLS]: {
    name: 'Visa Cash App RB F1 Team',
    primaryColor: '#6692FF',
    location: 'Faenza, Italy'
  },
  [TEAMS.AUDI]: {
    name: 'Audi F1 Team',
    primaryColor: '#F50537',
    location: 'Neuburg, Germany'
  },
  [TEAMS.CADILLAC]: {
    name: 'Cadillac Andretti F1 Team',
    primaryColor: '#FFD700',
    location: 'Indianapolis, USA'
  }
}

export const DEFAULT_TEAM = TEAMS.FERRARI
