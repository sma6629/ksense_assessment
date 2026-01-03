import "dotenv/config";
import getScoringResults from "./getScores.ts";

const API_KEY = process.env.API_KEY!;
const API_GET_PATIENTS_URL = process.env.API_GET_PATIENTS_URL!;
const API_POST_SCORES_URL = process.env.API_POST_SCORES_URL!;

async function submitScore() {
    const res = await getScoringResults(API_GET_PATIENTS_URL, API_KEY);

    const submitBody = JSON.stringify(res);

    try {
        const submitRes = await fetch(API_POST_SCORES_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": API_KEY,
            },
            body: submitBody,
        });

        if (submitRes.status != 200) {
            throw new Error(`submission failed with status code ${submitRes.status}`);
        }

        const submitResData = await submitRes.json();
        console.log(submitResData);
    } catch (err) {
        console.log(err);
    }
}

submitScore();
