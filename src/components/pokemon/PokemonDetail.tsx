import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Heart, RefreshCw, Share2 } from 'lucide-react';
import { usePokemonContext } from '../../contexts/PokemonContext';
import { fetchPokemonSpecies, fetchEvolutionChain } from '../../services/api';
import TypeBadge from '../common/TypeBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import { PokemonEvolution, PokemonSpecies, EvolutionChain } from '../../types/pokemon';

const PokemonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pokemonId = parseInt(id || '0', 10);
  
  const { 
    allPokemon, 
    getPokemonById, 
    isLoading, 
    isFavorite, 
    toggleFavorite,
    getRandomPokemonId
  } = usePokemonContext();
  
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [evolutionChain, setEvolutionChain] = useState<PokemonEvolution[]>([]);
  const [activeTab, setActiveTab] = useState<'about' | 'stats' | 'evolution'>('about');
  const [isSpeciesLoading, setIsSpeciesLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  const pokemon = getPokemonById(pokemonId);

  useEffect(() => {
    // Reset state when Pokemon ID changes
    setSpecies(null);
    setEvolutionChain([]);
    setError(null);
    
    const fetchAdditionalData = async () => {
      if (!pokemon) return;
      
      try {
        setIsSpeciesLoading(true);
        // Fetch species data
        const speciesData = await fetchPokemonSpecies(pokemon.id);
        setSpecies(speciesData);
        
        // Fetch evolution chain
        if (speciesData.evolution_chain) {
          const evolutionData = await fetchEvolutionChain(speciesData.evolution_chain.url);
          const evolutions = processEvolutionChain(evolutionData);
          setEvolutionChain(evolutions);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Error fetching Pokémon data'));
        console.error('Error fetching additional data:', err);
      } finally {
        setIsSpeciesLoading(false);
      }
    };
    
    fetchAdditionalData();
  }, [pokemon]);

  // Process evolution chain data into a flattened array
  const processEvolutionChain = (data: EvolutionChain): PokemonEvolution[] => {
    const evolutions: PokemonEvolution[] = [];
    
    const extractEvolutions = (chain: any) => {
      const pokemonName = chain.species.name;
      // Extract ID from URL
      const urlParts = chain.species.url.split('/');
      const id = parseInt(urlParts[urlParts.length - 2], 10);
      
      // Find the sprite for this Pokémon
      const pokemonData = getPokemonById(id);
      const sprite = pokemonData?.sprites.front_default || '';
      
      evolutions.push({ name: pokemonName, id, sprite });
      
      // Recursively extract evolutions
      if (chain.evolves_to && chain.evolves_to.length > 0) {
        chain.evolves_to.forEach((evolution: any) => {
          extractEvolutions(evolution);
        });
      }
    };
    
    extractEvolutions(data.chain);
    return evolutions;
  };

  // Handle random Pokémon navigation
  const navigateToRandomPokemon = () => {
    const randomId = getRandomPokemonId();
    navigate(`/pokemon/${randomId}`);
  };

  // Get description from flavor text
  const getDescription = () => {
    if (!species) return 'Loading description...';
    
    const englishEntry = species.flavor_text_entries.find(
      entry => entry.language.name === 'en'
    );
    
    return englishEntry 
      ? englishEntry.flavor_text.replace(/\f/g, ' ')
      : 'No description available.';
  };

  if (isLoading || !pokemon) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" message="Loading Pokémon details..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
        <p className="text-red-600">{error.message}</p>
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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with image and basic info */}
      <div className={`p-6 relative ${pokemon.types[0].type.name}-bg`}>
        <div className="absolute top-4 left-4 flex space-x-2">
          <Link
            to="/"
            className="p-2 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </Link>
          
          <button
            onClick={navigateToRandomPokemon}
            className="p-2 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
            aria-label="View random Pokémon"
          >
            <RefreshCw size={20} className="text-gray-700" />
          </button>
        </div>
        
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={() => toggleFavorite(pokemon.id)}
            className="p-2 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
            aria-label={isFavorite(pokemon.id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              size={20} 
              className={`${isFavorite(pokemon.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
            />
          </button>
          
          <button
            onClick={() => {
              const url = window.location.href;
              navigator.clipboard.writeText(url);
              alert('Link copied to clipboard!');
            }}
            className="p-2 bg-white bg-opacity-80 rounded-full shadow-sm hover:bg-opacity-100 transition-all"
            aria-label="Share"
          >
            <Share2 size={20} className="text-gray-600" />
          </button>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row items-center ">
          <div className="md:w-1/3 flex justify-center">
            <img
              src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
              alt={pokemon.name}
              className="h-48 w-48 object-contain"
            />
          </div>
          
          <div className="md:w-2/3 mt-6 md:mt-0 text-center md:text-left">
            <div className="bg-white bg-opacity-90 p-4 rounded-lg shadow-sm">
              <div className="text-gray-500 mb-1">#{String(pokemon.id).padStart(3, '0')}</div>
              <h1 className="text-3xl font-bold capitalize mb-3">{pokemon.name}</h1>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                {pokemon.types.map(typeInfo => (
                  <TypeBadge 
                    key={typeInfo.type.name} 
                    type={typeInfo.type.name} 
                    size="large" 
                  />
                ))}
              </div>
              
              <div className="flex justify-center md:justify-start gap-8 text-gray-700">
                <div>
                  <div className="text-sm text-gray-500">Height</div>
                  <div className="font-medium">{(pokemon.height / 10).toFixed(1)} m</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Weight</div>
                  <div className="font-medium">{(pokemon.weight / 10).toFixed(1)} kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'about'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'stats'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Base Stats
          </button>
          <button
            onClick={() => setActiveTab('evolution')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'evolution'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Evolution
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="p-6">
        {/* About Tab */}
        {activeTab === 'about' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {isSpeciesLoading ? 'Loading description...' : getDescription()}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Abilities</h3>
              <ul className="space-y-2">
                {pokemon.abilities.map((abilityInfo, index) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                      {abilityInfo.is_hidden ? 'Hidden' : 'Regular'}
                    </span>
                    <span className="capitalize">{abilityInfo.ability.name.replace('-', ' ')}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Base Stats</h3>
            <div className="space-y-4">
              {pokemon.stats.map(statInfo => {
                const statName = statInfo.stat.name.replace(/-/g, ' ');
                const statValue = statInfo.base_stat;
                const maxStat = 255; // Maximum possible base stat
                const percentage = (statValue / maxStat) * 100;
                
                // Determine color based on stat value
                let colorClass = 'bg-red-500';
                if (statValue >= 80) colorClass = 'bg-green-500';
                else if (statValue >= 50) colorClass = 'bg-yellow-500';
                
                return (
                  <div key={statInfo.stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {statName}
                      </span>
                      <span className="text-sm font-medium text-gray-700">
                        {statValue}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${colorClass}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Stat Total</h3>
              <div className="text-2xl font-bold">
                {pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}
              </div>
            </div>
          </div>
        )}
        
        {/* Evolution Tab */}
        {activeTab === 'evolution' && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Evolution Chain</h3>
            
            {isSpeciesLoading ? (
              <LoadingSpinner message="Loading evolution data..." />
            ) : evolutionChain.length === 0 ? (
              <p className="text-gray-500">No evolution data available.</p>
            ) : (
              <div className="flex flex-col items-center sm:flex-row sm:justify-center sm:flex-wrap gap-4">
                {evolutionChain.map((evolution, index) => (
                  <React.Fragment key={evolution.id}>
                    <Link
                      to={`/pokemon/${evolution.id}`}
                      className={`flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${
                        evolution.id === pokemon.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        #{String(evolution.id).padStart(3, '0')}
                      </div>
                      {evolution.sprite && (
                        <img 
                          src={evolution.sprite} 
                          alt={evolution.name} 
                          className="w-20 h-20 object-contain" 
                        />
                      )}
                      <div className="text-center capitalize font-medium mt-2">
                        {evolution.name}
                      </div>
                    </Link>
                    
                    {/* Arrow between evolutions */}
                    {index < evolutionChain.length - 1 && (
                      <div className="hidden sm:block text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Compare Button */}
      <div className="p-6 border-t border-gray-200 flex justify-center">
        <Link
          to={`/compare?pokemon1=${pokemon.id}`}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Compare with Another Pokémon
        </Link>
      </div>
    </div>
  );
};

export default PokemonDetail;