import { useState, useEffect, useMemo } from 'react';
import { fetchPokemonList, fetchPokemonDetails } from '../services/api';
import { Pokemon, PokemonListItem } from '../types/pokemon';

interface UsePokemonDataResult {
  allPokemon: Pokemon[];
  isLoading: boolean;
  error: Error | null;
  getPokemonById: (id: number) => Pokemon | undefined;
}

export const usePokemonData = (): UsePokemonDataResult => {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPokemonData = async () => {
      try {
        setIsLoading(true);
        const listResponse = await fetchPokemonList(150);
        
        // Fetch detailed data for all Pokémon in parallel
        const detailedPokemon = await Promise.all(
          listResponse.results.map(async (pokemon: PokemonListItem) => {
            const pokemonId = extractPokemonIdFromUrl(pokemon.url);
            return await fetchPokemonDetails(pokemonId);
          })
        );
        
        setAllPokemon(detailedPokemon);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load Pokémon data'));
        console.error('Error loading Pokémon data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPokemonData();
  }, []);

  // Extract Pokémon ID from URL
  const extractPokemonIdFromUrl = (url: string): number => {
    const matches = url.match(/\/(\d+)\/$/);
    return matches ? parseInt(matches[1], 10) : 0;
  };

  // Helper function to get a Pokémon by ID
  const getPokemonById = useMemo(() => {
    return (id: number) => allPokemon.find(pokemon => pokemon.id === id);
  }, [allPokemon]);

  return { allPokemon, isLoading, error, getPokemonById };
};