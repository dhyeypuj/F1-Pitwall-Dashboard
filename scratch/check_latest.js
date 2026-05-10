import axios from 'axios';

async function checkLatest() {
    try {
        const url = `https://api.jolpi.ca/ergast/f1/current/last/results.json`;
        const response = await axios.get(url);
        const race = response.data.MRData.RaceTable.Races[0];
        if (race) {
            console.log(`Latest Race in API: ${race.season} ${race.raceName}`);
            console.log(`Winner: ${race.Results[0].Driver.familyName}`);
            console.log(`Date: ${race.date}`);
        } else {
            console.log("No latest results found");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

checkLatest();
