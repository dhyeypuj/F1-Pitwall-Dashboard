/**
 * F1 Circuit Enrichment Metadata
 * Stores track-specific detail data not provided by standard APIs.
 */

export const defaultMetadata = {
  countryCode: "UN",
  trackLength: "—",
  distanceKm: "—",
  cornerCount: 0,
  drsZones: 0,
  lapRecord: "—",
  lapRecordHolder: "—",
  previousWinner: "—",
  trackImage: "generic_track.png"
}

export const circuitMetadata = {
  albert_park: {
    countryCode: "AU",
    trackLength: "5.278 km",
    laps: 58,
    cornerCount: 14,
    drsZones: 4,
    lapRecord: "1:19.813",
    lapRecordHolder: "Charles Leclerc",
    previousWinner: "Lando Norris",
    trackImage: "albert_park.png"
  },
  shanghai: {
    countryCode: "CN",
    trackLength: "5.451 km",
    laps: 56,
    cornerCount: 16,
    drsZones: 2,
    lapRecord: "1:32.238",
    lapRecordHolder: "Michael Schumacher",
    previousWinner: "Oscar Piastri",
    trackImage: "shanghai.png"
  },
  suzuka: {
    countryCode: "JP",
    trackLength: "5.807 km",
    laps: 53,
    cornerCount: 18,
    drsZones: 1,
    lapRecord: "1:30.983",
    lapRecordHolder: "Lewis Hamilton",
    previousWinner: "Max Verstappen",
    trackImage: "suzuka.png"
  },
  miami: {
    countryCode: "US",
    trackLength: "5.412 km",
    laps: 57,
    cornerCount: 19,
    drsZones: 3,
    lapRecord: "1:29.708",
    lapRecordHolder: "Max Verstappen",
    previousWinner: "Oscar Piastri",
    trackImage: "miami.png"
  },
  villeneuve: {
    countryCode: "CA",
    trackLength: "4.361 km",
    laps: 70,
    cornerCount: 14,
    drsZones: 3,
    lapRecord: "1:13.078",
    lapRecordHolder: "Valtteri Bottas",
    previousWinner: "George Russell",
    trackImage: "montreal.png"
  },
  monaco: {
    countryCode: "MC",
    trackLength: "3.337 km",
    laps: 78,
    cornerCount: 19,
    drsZones: 1,
    lapRecord: "1:12.909",
    lapRecordHolder: "Lewis Hamilton",
    previousWinner: "Lando Norris",
    trackImage: "monaco.png"
  },
  catalunya: {
    countryCode: "ES",
    trackLength: "4.657 km",
    laps: 66,
    cornerCount: 14,
    drsZones: 2,
    lapRecord: "1:16.330",
    lapRecordHolder: "Max Verstappen",
    previousWinner: "Oscar Piastri",
    trackImage: "barcelona.png"
  },
  red_bull_ring: {
    countryCode: "AT",
    trackLength: "4.318 km",
    laps: 71,
    cornerCount: 10,
    drsZones: 3,
    lapRecord: "1:05.619",
    lapRecordHolder: "Carlos Sainz",
    previousWinner: "Lando Norris",
    trackImage: "spielberg.png"
  },
  silverstone: {
    countryCode: "GB",
    trackLength: "5.891 km",
    laps: 52,
    cornerCount: 18,
    drsZones: 2,
    lapRecord: "1:27.097",
    lapRecordHolder: "Max Verstappen",
    previousWinner: "Lando Norris",
    trackImage: "silverstone.png"
  },
  spa: {
    countryCode: "BE",
    trackLength: "7.004 km",
    laps: 44,
    cornerCount: 19,
    drsZones: 2,
    lapRecord: "1:44.701",
    lapRecordHolder: "Sergio Pérez",
    previousWinner: "Oscar Piastri",
    trackImage: "spa.png"
  },
  hungaroring: {
    countryCode: "HU",
    trackLength: "4.381 km",
    laps: 70,
    cornerCount: 14,
    drsZones: 2,
    lapRecord: "1:16.627",
    lapRecordHolder: "Lewis Hamilton",
    previousWinner: "Lando Norris",
    trackImage: "hungaroring.png"
  },
  zandvoort: {
    countryCode: "NL",
    trackLength: "4.259 km",
    laps: 72,
    cornerCount: 14,
    drsZones: 2,
    lapRecord: "1:11.097",
    lapRecordHolder: "Lewis Hamilton",
    previousWinner: "Oscar Piastri",
    trackImage: "zandvoort.png"
  },
  monza: {
    countryCode: "IT",
    trackLength: "5.793 km",
    laps: 53,
    cornerCount: 11,
    drsZones: 2,
    lapRecord: "1:21.046",
    lapRecordHolder: "Rubens Barrichello",
    previousWinner: "Max Verstappen",
    trackImage: "monza.png"
  },
  madrid: {
    countryCode: "ES",
    trackLength: "5.474 km",
    laps: 57,
    cornerCount: 20,
    drsZones: 2,
    lapRecord: "—",
    lapRecordHolder: "—",
    previousWinner: "—",
    trackImage: "madrid.png"
  },
  baku: {
    countryCode: "AZ",
    trackLength: "6.003 km",
    laps: 51,
    cornerCount: 20,
    drsZones: 2,
    lapRecord: "1:43.009",
    lapRecordHolder: "Charles Leclerc",
    previousWinner: "Max Verstappen",
    trackImage: "baku.png"
  },
  marina_bay: {
    countryCode: "SG",
    trackLength: "4.940 km",
    laps: 62,
    cornerCount: 19,
    drsZones: 3,
    lapRecord: "1:34.486",
    lapRecordHolder: "Daniel Ricciardo",
    previousWinner: "George Russell",
    trackImage: "singapore.png"
  },
  americas: {
    countryCode: "US",
    trackLength: "5.513 km",
    laps: 56,
    cornerCount: 20,
    drsZones: 2,
    lapRecord: "1:36.169",
    lapRecordHolder: "Charles Leclerc",
    previousWinner: "Max Verstappen",
    trackImage: "austin.png"
  },
  rodriguez: {
    countryCode: "MX",
    trackLength: "4.304 km",
    laps: 71,
    cornerCount: 17,
    drsZones: 3,
    lapRecord: "1:17.774",
    lapRecordHolder: "Valtteri Bottas",
    previousWinner: "Lando Norris",
    trackImage: "mexico.png"
  },
  interlagos: {
    countryCode: "BR",
    trackLength: "4.309 km",
    laps: 71,
    cornerCount: 15,
    drsZones: 2,
    lapRecord: "1:10.540",
    lapRecordHolder: "Valtteri Bottas",
    previousWinner: "Lando Norris",
    trackImage: "brazil.png"
  },
  las_vegas: {
    countryCode: "US",
    trackLength: "6.201 km",
    laps: 50,
    cornerCount: 17,
    drsZones: 2,
    lapRecord: "1:35.490",
    lapRecordHolder: "Oscar Piastri",
    previousWinner: "Max Verstappen",
    trackImage: "las_vegas.png"
  },
  losail: {
    countryCode: "QA",
    trackLength: "5.419 km",
    laps: 57,
    cornerCount: 16,
    drsZones: 1,
    lapRecord: "1:22.384",
    lapRecordHolder: "Lando Norris",
    previousWinner: "Max Verstappen",
    trackImage: "qatar.png"
  },
  yas_marina: {
    countryCode: "AE",
    trackLength: "5.281 km",
    laps: 58,
    cornerCount: 16,
    drsZones: 2,
    lapRecord: "1:26.103",
    lapRecordHolder: "Max Verstappen",
    previousWinner: "Max Verstappen",
    trackImage: "abu_dhabi.png"
  }
}

// Resilient lookup helper that standardizes names to normalized keys
const normalizeName = (name) => {
  if (!name) return "";
  return name.toLowerCase()
    .replace(/grand prix/g, "")
    .replace(/gp/g, "")
    .replace(/circuit/g, "")
    .replace(/de/g, "")
    .replace(/di/g, "")
    .replace(/del/g, "")
    .replace(/[^a-z0-9]/g, "");
}

// Create a normalized lookup index
const normalizedIndex = {}
Object.entries(circuitMetadata).forEach(([key, value]) => {
  normalizedIndex[normalizeName(key)] = value
})

// Specific manual alias mapping for edge cases
const manualAliases = {
  melbourne: "albert_park",
  shanghai: "shanghai",
  suzuka: "suzuka",
  miami: "miami",
  montreal: "villeneuve",
  montral: "villeneuve",
  montecarlo: "monaco",
  barcelona: "catalunya",
  catalunya: "catalunya",
  spielberg: "red_bull_ring",
  silverstone: "silverstone",
  spa: "spa",
  stavelot: "spa",
  spahrchamps: "spa",
  budapest: "hungaroring",
  hungaroring: "hungaroring",
  zandvoort: "zandvoort",
  monza: "monza",
  madrid: "madrid",
  baku: "baku",
  singapore: "marina_bay",
  marinabay: "marina_bay",
  austin: "americas",
  cota: "americas",
  mexicocity: "rodriguez",
  mexico: "rodriguez",
  saopaulo: "interlagos",
  brazil: "interlagos",
  lasvegas: "las_vegas",
  qatar: "losail",
  lusail: "losail",
  abudhabi: "yas_marina",
  yasmarina: "yas_marina"
}

export const getRaceMetadata = (circuitId, countryName, localityName, raceName) => {
  let result = { ...defaultMetadata };

  // Try exact lookup on normalized circuitId first
  const cIdNorm = normalizeName(circuitId);
  let foundMeta = null;
  if (cIdNorm && normalizedIndex[cIdNorm]) {
    foundMeta = normalizedIndex[cIdNorm];
  } else {
    // Try exact lookup on manual aliases
    const searchTerms = [circuitId, localityName, countryName, raceName];
    for (const term of searchTerms) {
      if (term) {
        const normTerm = normalizeName(term);
        const aliasKey = manualAliases[normTerm];
        if (aliasKey && circuitMetadata[aliasKey]) {
          foundMeta = circuitMetadata[aliasKey];
          break;
        }
        if (normalizedIndex[normTerm]) {
          foundMeta = normalizedIndex[normTerm];
          break;
        }
      }
    }
  }

  if (foundMeta) {
    result = { ...result, ...foundMeta };
  }

  // Calculate distanceKm dynamically if trackLength and laps are available and distanceKm is not already set
  if (result.distanceKm === "—") {
    if (result.trackLength && result.trackLength !== "—" && result.laps) {
      const lenVal = parseFloat(result.trackLength);
      if (!isNaN(lenVal)) {
        result.distanceKm = (lenVal * result.laps).toFixed(3);
      }
    }
  }

  return result;
}
