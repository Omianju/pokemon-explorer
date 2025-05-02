import React, { useState, useMemo } from 'react';
import { usePokemonContext } from '../../contexts/PokemonContext';
import PokemonCard from './PokemonCard';
import SearchBar from '../common/SearchBar';
import TypeFilter from './TypeFilter';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import { Heart, LayoutGrid, List, RotateCcw, SortAsc, SortDesc } from 'lucide-react';
import { SortOption } from '../../types/pokemon';
import { Link } from 'react-router-dom';
import TypeBadge from '../common/TypeBadge';

const PokemonList: React.FC = () => {
  const { 
    currentPokemon,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    toggleType,
    selectedTypes,
    clearTypeFilters,
    sortOption,
    setSortOption,
    currentPage,
    setCurrentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    itemsPerPage,
    setItemsPerPage,
    isFavorite,
    toggleFavorite,
  } = usePokemonContext();

  // State for grid/list view toggle
  const [isGridView, setIsGridView] = useState(true);
  
  // Get all available types from the first 150 Pokémon
  const allTypes = useMemo(() => {
    const typesSet = new Set<string>();
    currentPokemon.forEach(pokemon => {
      pokemon.types.forEach(typeInfo => {
        typesSet.add(typeInfo.type.name);
      });
    });
    return Array.from(typesSet).sort();
  }, [currentPokemon]);

  // Sort options
  const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
    { value: 'id_asc', label: 'ID (Ascending)', icon: <SortAsc size={18} /> },
    { value: 'name_asc', label: 'Name (A-Z)', icon: <SortAsc size={18} /> },
    { value: 'name_desc', label: 'Name (Z-A)', icon: <SortDesc size={18} /> },
  ];

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading Pokémon..." />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold text-red-600 mb-2">Error Loading Pokémon</h2>
        <p className="text-gray-700">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <SearchBar 
              onSearch={setSearchTerm} 
              initialValue={searchTerm} 
              placeholder="Search by name or ID..." 
            />
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <SortAsc size={16} className="text-gray-400" />
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setIsGridView(true)}
                className={`p-2 ${isGridView ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                onClick={() => setIsGridView(false)}
                className={`p-2 ${!isGridView ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Type Filters */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">Filter by Type</h3>
            {selectedTypes.length > 0 && (
              <button
                onClick={clearTypeFilters}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Clear filters
              </button>
            )}
          </div>
          <TypeFilter
            allTypes={allTypes}
            selectedTypes={selectedTypes}
            onToggleType={toggleType}
          />
        </div>
      </div>
      
      {/* Pokémon List */}
      {currentPokemon.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Pokémon Found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
          <button
            onClick={clearTypeFilters}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {isGridView ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {currentPokemon.map(pokemon => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  isFavorite={isFavorite(pokemon.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4 ">
              {currentPokemon.map(pokemon => (
                <div
                  key={pokemon.id}
                  className="flex items-center p-4 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl"
                >
                  <div className="bg-gray-100 p-4 w-24 h-24 flex-shrink-0">
                    <img
                      src={pokemon.sprites.front_default}
                      alt={pokemon.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-grow p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold capitalize">{pokemon.name}</h2>
                        <div className="text-sm text-gray-500 mb-2">#{String(pokemon.id).padStart(3, '0')}</div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(pokemon.id);
                        }}
                        className="p-1.5 bg-white rounded-full shadow-sm self-end"
                      >
                        <Heart 
                          size={20} 
                          className={`${isFavorite(pokemon.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                        />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pokemon.types.map(typeInfo => (
                        <TypeBadge 
                          key={typeInfo.type.name} 
                          type={typeInfo.type.name} 
                          size="small"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    <Link
                      to={`/pokemon/${pokemon.id}`}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors whitespace-nowrap"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onPreviousPage={goToPreviousPage}
            onNextPage={goToNextPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default PokemonList;