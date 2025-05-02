import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Pokemon } from '../../types/pokemon';
import TypeBadge from '../common/TypeBadge';

interface PokemonCardProps {
  pokemon: Pokemon;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ 
  pokemon, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const formattedId = String(pokemon.id).padStart(3, '0');
  
  // Handle favorite toggling without navigating
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(pokemon.id);
  };

  return (
    <Link 
      to={`/pokemon/${pokemon.id}`} 
      className="group block overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1"
    >
      <div className="relative bg-gray-100 p-4 flex justify-center">
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm z-10 transition-colors"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={20} 
            className={`${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
          />
        </button>
        
        {/* Pokémon ID */}
        <div className="absolute top-2 left-2 bg-gray-800 text-white text-xs font-bold py-1 px-2 rounded">
          #{formattedId}
        </div>
        
        {/* Pokémon Image */}
        <img
          src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
          alt={pokemon.name}
          className="h-32 w-32 object-contain transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      <div className="p-4">
        {/* Pokémon Name */}
        <h2 className="text-lg font-bold text-gray-800 capitalize mb-2">
          {pokemon.name}
        </h2>
        
        {/* Pokémon Types */}
        <div className="flex flex-wrap gap-2">
          {pokemon.types.map(typeInfo => (
            <TypeBadge 
              key={typeInfo.type.name} 
              type={typeInfo.type.name} 
            />
          ))}
        </div>
      </div>
    </Link>
  );
};

export default React.memo(PokemonCard);