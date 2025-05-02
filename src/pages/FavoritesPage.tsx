import React from 'react';
import FavoritePokemon from '../components/pokemon/FavoritePokemon';
import ErrorBoundary from '../components/common/ErrorBoundary';

const FavoritesPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <div>
        <h1 className="text-3xl font-bold mb-6">Favorites</h1>
        <FavoritePokemon />
      </div>
    </ErrorBoundary>
  );
};

export default FavoritesPage;