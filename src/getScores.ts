import getAllPatientData from "./getPatients.js";

export default async function getScoringResults(url: string, api_key: string) {
  const patients = await getAllPatientData(url, api_key);

  const highRiskPatients: string[] = [];
  const data_quality_issues: string[] = [];
  const feverPatients: string[] = [];

  // calculate total risk score for each patient
  patients.forEach((p) => {
    const bpScore = getBPScore(p.blood_pressure);
    const tempScore = getTempScore(p.temperature);
    const ageScore = getAgeScore(p.age);

    if (bpScore == null || tempScore === null || ageScore === null) {
      data_quality_issues.push(p.patient_id);
      return;
    }

    if (p.temperature >= 99.6) {
      feverPatients.push(p.patient_id);
    }

    const totalScore = bpScore + tempScore + ageScore;
    if (totalScore >= 4) {
      highRiskPatients.push(p.patient_id);
    }
  });

  return {
    high_risk_patients: highRiskPatients,
    fever_patients: feverPatients,
    data_quality_issues: data_quality_issues,
  };
}

function getBPScore(bp: unknown): number | null {
  if (
    typeof bp !== "string" ||
    bp.trim() === "" ||
    bp === "INVALID" ||
    bp === "N/A"
  ) {
    return null;
  }

  const [s, d] = bp.split("/");
  if (!s || !d) return null;

  const systolic = Number(s.trim());
  const diastolic = Number(d.trim());

  if (!Number.isFinite(systolic) || !Number.isFinite(diastolic)) {
    return null;
  }

  if (systolic < 120 && diastolic < 80) return 0;
  if (systolic <= 129 && diastolic < 80) return 1;
  if (systolic <= 139 || diastolic <= 89) return 2;
  return 3;
}

function getTempScore(temp: unknown): number | null {
  if (temp === null || temp === undefined || temp === "") {
    return null;
  }

  const value = Number(temp);

  if (!Number.isFinite(value)) {
    return null;
  }

  if (value <= 99.5) return 0;
  if (value <= 100.9) return 1;
  return 2; // ≥ 101°F
}

function getAgeScore(age: unknown): number | null {
  if (age === null || age === undefined || age === "") {
    return null;
  }

  const value = Number(age);

  if (!Number.isFinite(value)) {
    return null;
  }

  if (value > 65) return 2;
  return 1; // <40 or 40–65 inclusive
}
