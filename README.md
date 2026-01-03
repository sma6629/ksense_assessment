# Healthcare API
A Node.js + TypeScript application that fetches, processes, and analyzes patient health data from a paginated external API.

### Requirements
- Node.js ≥ 18 (for native fetch)
- npm

### Installation
```
git clone https://github.com/sma6629/ksense_assessment.git
cd health_api_project
npm install
```
### Environment Variables
- API_GET_PATIENTS_URL = `https://assessment.ksensetech.com/api/patients`
- API_POST_SCORES_URL = `https://assessment.ksensetech.com/api/submit-assessment`
- API_KEY=api_key_goes_here

### Build and run
```
npm run build
npm run start
```
