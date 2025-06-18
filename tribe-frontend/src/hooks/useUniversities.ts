import { useQuery } from '@tanstack/react-query';
import { fetchUniversities } from '../services/universityService';
import type { University } from '../contexts/universityTypes';

export const useUniversities = (searchQuery: string = '') => {
  const {
    data: allUniversities = [],
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['universities'],
    queryFn: fetchUniversities,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });

  // Filter universities based on search query
  const filteredUniversities = searchQuery.trim()
    ? allUniversities.filter(university =>
        university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        university.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allUniversities;

  return {
    universities: filteredUniversities,
    allUniversities,
    isLoading,
    error: isError ? (error as Error) : null,
  };
}; 