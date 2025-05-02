import { useState, useCallback, useMemo } from 'react';
import { Pokemon, SortOption } from '../types/pokemon';

interface UseFiltersResult {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTypes: string[];
  toggleType: (type: string) => void;
  clearTypeFilters: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  filteredPokemon: Pokemon[];
}

export const useFilters = (pokemon: Pokemon[]): UseFiltersResult => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('id_asc');
  
  // Toggle type selection
  const toggleType = useCallback((type: string) => {
    setSelectedTypes(prevTypes => 
      prevTypes.includes(type)
        ? prevTypes.filter(t => t !== type)
        : [...prevTypes, type]
    );
  }, []);

  // Clear all type filters
  const clearTypeFilters = useCallback(() => {
    setSelectedTypes([]);
  }, []);

  // Filter and sort Pokémon based on search term, selected types, and sort option
  const filteredPokemon = useMemo(() => {
    let filtered = [...pokemon];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const normalizedSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(normalizedSearchTerm) || 
        p.id.toString().includes(normalizedSearchTerm)
      );
    }
    
    // Apply type filter
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(p => 
        selectedTypes.every(type => 
          p.types.some(t => t.type.name === type)
        )
      );
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'id_asc':
        default:
          return a.id - b.id;
      }
    });
  }, [pokemon, searchTerm, selectedTypes, sortOption]);

  return {
    searchTerm,
    setSearchTerm,
    selectedTypes,
    toggleType,
    clearTypeFilters,
    sortOption,
    setSortOption,
    filteredPokemon,
  };
};