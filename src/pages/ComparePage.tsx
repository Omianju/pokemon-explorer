import React, { Suspense } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy load the PokemonCompare component
const PokemonCompare = React.lazy(() => import('../components/pokemon/PokemonCompare'));

const ComparePage: React.FC = () => {
  return (
    <ErrorBoundary>
      <div>
        <h1 className="text-3xl font-bold mb-6">Compare Pokémon</h1>
        <Suspense fallback={<LoadingSpinner size="large" message="Loading comparison tool..." />}>
          <PokemonCompare />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default ComparePage;