import axios from 'axios';

async function checkResults() {
    try {
        // We'll check 2024 results for these locations
        // australia (Mel), china (Sha), japan (Suz), miami (Mia)
        const races = [
            { id: '3', name: 'Australian GP', year: 2024 }, // Round 3 in 2024
            { id: '5', name: 'Chinese GP', year: 2024 },    // Round 5 in 2024
            { id: '4', name: 'Japanese GP', year: 2024 },   // Round 4 in 2024
            { id: '6', name: 'Miami GP', year: 2024 }      // Round 6 in 2024
        ];

        console.log("--- Real 2024 Results for these Locations ---");
        for (const race of races) {
            const url = `https://api.jolpi.ca/ergast/f1/${race.year}/${race.id}/results/1.json`;
            const response = await axios.get(url);
            const raceData = response.data.MRData.RaceTable.Races[0];
            if (raceData) {
                console.log(`${race.name} (Round ${race.id}): ${raceData.Results[0].Driver.givenName[0]}. ${raceData.Results[0].Driver.familyName}`);
            } else {
                console.log(`${race.name}: No data found`);
            }
        }
    } catch (error) {
        console.error("Error fetching results:", error.message);
    }
}

checkResults();
