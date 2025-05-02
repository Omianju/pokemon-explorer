import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PokemonProvider } from './contexts/PokemonContext';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const DetailPage = React.lazy(() => import('./pages/DetailPage'));
const FavoritesPage = React.lazy(() => import('./pages/FavoritesPage'));
const ComparePage = React.lazy(() => import('./pages/ComparePage'));

function App() {
  return (
    <ErrorBoundary >
      <PokemonProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route 
                index 
                element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <HomePage />
                  </React.Suspense>
                } 
              />
              <Route 
                path="pokemon/:id" 
                element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <DetailPage />
                  </React.Suspense>
                } 
              />
              <Route 
                path="favorites" 
                element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <FavoritesPage />
                  </React.Suspense>
                } 
              />
              <Route 
                path="compare" 
                element={
                  <React.Suspense fallback={<div>Loading...</div>}>
                    <ComparePage />
                  </React.Suspense>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </PokemonProvider>
    </ErrorBoundary>
  );
}

export default App;