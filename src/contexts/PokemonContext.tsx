import React, { createContext, ReactNode, useContext } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { useFilters } from '../hooks/useFilters';
import { usePagination } from '../hooks/usePagination';
import { usePokemonData } from '../hooks/usePokemonData';
import { getUISettings, saveUISettings } from '../services/localStorage';
import { Pokemon, SortOption } from '../types/pokemon';

interface PokemonContextValue {
  // Data
  allPokemon: Pokemon[];
  filteredPokemon: Pokemon[];
  currentPokemon: Pokemon[];
  isLoading: boolean;
  error: Error | null;
  
  // Pagination
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  totalPages: number;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  
  // Filtering & Sorting
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedTypes: string[];
  toggleType: (type: string) => void;
  clearTypeFilters: () => void;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  
  // Favorites
  favorites: number[];
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  
  // Utilities
  getPokemonById: (id: number) => Pokemon | undefined;
  getRandomPokemonId: () => number;
}

// Create the context
const PokemonContext = createContext<PokemonContextValue | undefined>(undefined);

// Provider component
export const PokemonProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial UI settings from localStorage
  const uiSettings = getUISettings();
  
  // Set up data and hooks
  const { allPokemon, isLoading, error, getPokemonById } = usePokemonData();
  
  const {
    searchTerm,
    setSearchTerm,
    selectedTypes,
    toggleType,
    clearTypeFilters,
    sortOption,
    setSortOption,
    filteredPokemon,
  } = useFilters(allPokemon);
  
  const {
    currentItems: currentPokemon,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    paginationSettings,
  } = usePagination(filteredPokemon, uiSettings.pagination);
  
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  // Save UI settings to localStorage whenever they change
  React.useEffect(() => {
    const newSettings = {
      pagination: paginationSettings,
      sorting: sortOption,
      filters: {
        types: selectedTypes,
      },
    };
    saveUISettings(newSettings);
  }, [paginationSettings, sortOption, selectedTypes]);
  
  // Function to get a random Pokémon ID
  const getRandomPokemonId = React.useCallback(() => {
    const randomIndex = Math.floor(Math.random() * allPokemon.length);
    return allPokemon[randomIndex]?.id || 1;
  }, [allPokemon]);
  
  // Combine all the values into the context
  const contextValue: PokemonContextValue = {
    allPokemon,
    filteredPokemon,
    currentPokemon,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    searchTerm,
    setSearchTerm,
    selectedTypes,
    toggleType,
    clearTypeFilters,
    sortOption,
    setSortOption,
    favorites,
    toggleFavorite,
    isFavorite,
    getPokemonById,
    getRandomPokemonId,
  };
  
  return (
    <PokemonContext.Provider value={contextValue}>
      {children}
    </PokemonContext.Provider>
  );
};

// Custom hook to use the context
export const usePokemonContext = (): PokemonContextValue => {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
};