import axios from 'axios';
import type { University } from '../contexts/universityTypes';
import { API_BASE_URL } from '../contexts/config';

interface UniversityResponse {
  success: boolean;
  statusCode: number;
  universities: University[];
}

export const fetchUniversities = async (): Promise<University[]> => {
  const response = await axios.get<UniversityResponse>(`${API_BASE_URL}/university`);
  return response.data.universities;
}; 