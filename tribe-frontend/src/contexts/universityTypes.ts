export interface University {
  id: string;
  name: string;
  domain: string;
  location: string;
}

export interface UniversityContextType {
  universities: University[];
  loading: boolean;
  error: string | null;
  searchUniversities: (query: string) => Promise<University[]>;
} 