import React from 'react';

interface TypeBadgeProps {
  type: string;
  size?: 'small' | 'medium' | 'large';
}

const TypeBadge: React.FC<TypeBadgeProps> = ({ type, size = 'medium' }) => {
  // Color mapping for Pokémon types
  const typeColors: Record<string, string> = {
    normal: 'bg-gray-400 text-gray-800',
    fire: 'bg-orange-500 text-white',
    water: 'bg-blue-500 text-white',
    electric: 'bg-yellow-400 text-gray-800',
    grass: 'bg-green-500 text-white',
    ice: 'bg-blue-200 text-blue-800',
    fighting: 'bg-red-700 text-white',
    poison: 'bg-purple-600 text-white',
    ground: 'bg-yellow-600 text-white',
    flying: 'bg-indigo-300 text-indigo-900',
    psychic: 'bg-pink-500 text-white',
    bug: 'bg-lime-500 text-white',
    rock: 'bg-yellow-800 text-white',
    ghost: 'bg-purple-800 text-white',
    dragon: 'bg-indigo-600 text-white',
    dark: 'bg-gray-800 text-white',
    steel: 'bg-gray-500 text-white',
    fairy: 'bg-pink-300 text-pink-900',
  };

  const sizeClasses = {
    small: 'text-xs px-1.5 py-0.5',
    medium: 'text-sm px-2 py-1',
    large: 'text-base px-3 py-1.5',
  };
  
  const baseClasses = 'rounded-full font-semibold inline-block';
  const colorClass = typeColors[type.toLowerCase()] || 'bg-gray-300 text-gray-700';
  
  return (
    <span className={`${baseClasses} ${colorClass} ${sizeClasses[size]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default React.memo(TypeBadge);