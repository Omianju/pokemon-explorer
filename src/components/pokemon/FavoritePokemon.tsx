import React from 'react';
import { Link } from 'react-router-dom';
import { usePokemonContext } from '../../contexts/PokemonContext';
import PokemonCard from './PokemonCard';
import { Heart } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const FavoritePokemon: React.FC = () => {
  const { allPokemon, favorites, toggleFavorite, isLoading } = usePokemonContext();
  
  // Get favorite Pokémon from the list
  const favoritePokemon = React.useMemo(() => {
    return allPokemon.filter(pokemon => favorites.includes(pokemon.id));
  }, [allPokemon, favorites]);
  
  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading your favorites..." />;
  }
  
  if (favoritePokemon.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-red-100 mb-4">
          <Heart size={32} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Favorites Yet</h2>
        <p className="text-gray-600 mb-6">
          You haven't added any Pokémon to your favorites list.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore Pokémon
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Favorite Pokémon</h1>
        <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
          {favoritePokemon.length} {favoritePokemon.length === 1 ? 'Pokémon' : 'Pokémon'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {favoritePokemon.map(pokemon => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            isFavorite={true}
            onToggleFavorite={toggleFavorite}
          />
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to All Pokémon
        </Link>
      </div>
    </div>
  );
};

export default FavoritePokemon;