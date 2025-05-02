import { Pokemon, PokemonListResponse, PokemonSpecies, EvolutionChain } from '../types/pokemon';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

/**
 * Fetches the list of Pokémon with the given limit
 */
export const fetchPokemonList = async (limit = 150): Promise<PokemonListResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}`);
    if (!response.ok) throw new Error('Failed to fetch Pokémon list');
    return await response.json();
  } catch (error) {
    console.error('Error fetching Pokémon list:', error);
    throw error;
  }
};

/**
 * Fetches detailed data for a specific Pokémon by name or ID
 */
export const fetchPokemonDetails = async (nameOrId: string | number): Promise<Pokemon> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon/${nameOrId}`);
    if (!response.ok) throw new Error(`Failed to fetch Pokémon details for ${nameOrId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pokémon details for ${nameOrId}:`, error);
    throw error;
  }
};

/**
 * Fetches species data for a specific Pokémon by ID
 */
export const fetchPokemonSpecies = async (id: number): Promise<PokemonSpecies> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pokemon-species/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch Pokémon species for ID ${id}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pokémon species for ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetches evolution chain for a Pokémon using the evolution chain URL
 */
export const fetchEvolutionChain = async (url: string): Promise<EvolutionChain> => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch evolution chain');
    return await response.json();
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    throw error;
  }
};

/**
 * Fetches multiple Pokémon details in parallel
 */
export const fetchMultiplePokemon = async (nameOrIds: (string | number)[]): Promise<Pokemon[]> => {
  try {
    const promises = nameOrIds.map(nameOrId => fetchPokemonDetails(nameOrId));
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching multiple Pokémon:', error);
    throw error;
  }
};