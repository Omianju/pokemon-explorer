import { useState, useEffect, useCallback } from 'react';
import { getFavorites, saveFavorites } from '../services/localStorage';

interface UseFavoritesResult {
  favorites: number[];
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
}

export const useFavorites = (): UseFavoritesResult => {
  const [favorites, setFavorites] = useState<number[]>([]);

  // Load favorites from localStorage on initial mount
  useEffect(() => {
    const storedFavorites = getFavorites();
    setFavorites(storedFavorites);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  // Add a Pokémon to favorites
  const addFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      if (!prev.includes(id)) {
        return [...prev, id];
      }
      return prev;
    });
  }, []);

  // Remove a Pokémon from favorites
  const removeFavorite = useCallback((id: number) => {
    setFavorites(prev => prev.filter(favId => favId !== id));
  }, []);

  // Toggle a Pokémon's favorite status
  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => 
      prev.includes(id)
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  }, []);

  // Check if a Pokémon is in favorites
  const isFavorite = useCallback((id: number) => {
    return favorites.includes(id);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite };
};