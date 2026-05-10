import axios from 'axios';

async function check2026() {
    try {
        const url = `https://api.jolpi.ca/ergast/f1/2026/results.json`;
        const response = await axios.get(url);
        const races = response.data.MRData.RaceTable.Races;
        console.log(`Found ${races.length} races with results in 2026 API`);
        races.forEach(r => {
            console.log(`Round ${r.round}: ${r.raceName} - Winner: ${r.Results[0].Driver.familyName}`);
        });
    } catch (error) {
        console.error("Error:", error.message);
    }
}

check2026();
