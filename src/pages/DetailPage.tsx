import React, { Suspense } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Lazy load the PokemonDetail component
const PokemonDetail = React.lazy(() => import('../components/pokemon/PokemonDetail'));

const DetailPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner size="large" message="Loading Pokémon details..." />}>
        <PokemonDetail />
      </Suspense>
    </ErrorBoundary>
  );
};

export default DetailPage;