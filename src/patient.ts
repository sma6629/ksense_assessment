export interface Patient {
  patient_id: string;
  name: string;
  age: number;
  gender: string;
  blood_pressure: string;
  temperature: number;
  visit_data: string;
  diagnosis: string;
  medications: string;
}

export interface APIResponse {
  data: Patient[];
  pagination: Pagination;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
