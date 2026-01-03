async function fetchPatientsFromAPI(url, api_key, page, limit = 10, retries = 3) {
    try {
        const response = await fetch(`${url}?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": api_key,
            },
        });
        if (response.status == 429 || response.status >= 500) {
            throw new Error("Retrying...");
        }
        const data = await response.json();
        return data;
    }
    catch (err) {
        if (retries === 0)
            throw err;
        // delay before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchPatientsFromAPI(url, api_key, page, limit, retries - 1);
    }
}
export default async function getAllPatientData(url, api_key) {
    let page = 1;
    let hasNext = true;
    const patients = [];
    while (hasNext) {
        try {
            const response = await fetchPatientsFromAPI(url, api_key, page);
            if (response.data.length > 0) {
                patients.push(...response.data);
            }
            console.log(`Getting patients from page: ${page}`);
            hasNext = response.pagination.hasNext;
            page++;
            // delay before fetching the next batch of patients
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        catch (err) {
            // skip calling this page if all attempts fail
            page++;
        }
    }
    return patients;
}
