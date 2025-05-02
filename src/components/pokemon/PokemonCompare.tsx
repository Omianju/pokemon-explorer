import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePokemonContext } from '../../contexts/PokemonContext';
import TypeBadge from '../common/TypeBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import { X, Shuffle } from 'lucide-react';

const PokemonCompare: React.FC = () => {
  const { allPokemon, isLoading, getPokemonById } = usePokemonContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [pokemon1Id, setPokemon1Id] = useState<number | null>(
    searchParams.get('pokemon1') ? parseInt(searchParams.get('pokemon1') || '0', 10) : null
  );
  const [pokemon2Id, setPokemon2Id] = useState<number | null>(
    searchParams.get('pokemon2') ? parseInt(searchParams.get('pokemon2') || '0', 10) : null
  );

  // Update URL when selected Pokémon change
  useEffect(() => {
    const params = new URLSearchParams();
    if (pokemon1Id) params.set('pokemon1', pokemon1Id.toString());
    if (pokemon2Id) params.set('pokemon2', pokemon2Id.toString());
    navigate({ search: params.toString() }, { replace: true });
  }, [pokemon1Id, pokemon2Id, navigate]);
  
  const pokemon1 = pokemon1Id ? getPokemonById(pokemon1Id) : null;
  const pokemon2 = pokemon2Id ? getPokemonById(pokemon2Id) : null;

  // Function to get a random Pokémon ID for the second slot
  const getRandomPokemonId = () => {
    const availablePokemon = allPokemon.filter(p => p.id !== pokemon1Id);
    if (availablePokemon.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availablePokemon.length);
    return availablePokemon[randomIndex].id;
  };

  // Function to set random Pokémon for the second slot
  const setRandomSecondPokemon = () => {
    const randomId = getRandomPokemonId();
    if (randomId) {
      setPokemon2Id(randomId);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="large" message="Loading Pokémon data..." />;
  }

  // Get the maximum value for each stat across all Pokémon
  const getMaxStatValue = (statName: string): number => {
    return Math.max(
      ...allPokemon.map(p => {
        const stat = p.stats.find(s => s.stat.name === statName);
        return stat ? stat.base_stat : 0;
      })
    );
  };
  
  // Get stat value for a specific Pokémon
  const getStatValue = (pokemon: any, statName: string): number => {
    if (!pokemon) return 0;
    const stat = pokemon.stats.find((s: any) => s.stat.name === statName);
    return stat ? stat.base_stat : 0;
  };
  
  // Calculate comparison percentage
  const getComparisonPercentage = (value1: number, value2: number): string => {
    if (value1 === 0 && value2 === 0) return '0%';
    const higher = Math.max(value1, value2);
    const lower = Math.min(value1, value2);
    return higher === 0 ? '0%' : `${Math.round((higher - lower) / higher * 100)}%`;
  };
  
  // Calculate stat bar width percentage
  const getStatBarWidth = (value: number, statName: string): string => {
    const maxValue = getMaxStatValue(statName);
    return `${(value / maxValue) * 100}%`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-6">Compare Pokémon</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pokémon 1 Selector */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Select First Pokémon</h2>
          <div className="relative">
            <select
              value={pokemon1Id || ''}
              onChange={(e) => setPokemon1Id(Number(e.target.value) || null)}
              className="block w-full p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Pokémon</option>
              {allPokemon.map(pokemon => (
                <option key={pokemon.id} value={pokemon.id}>
                  #{String(pokemon.id).padStart(3, '0')} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {pokemon1Id && (
            <button
              onClick={() => setPokemon1Id(null)}
              className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center"
            >
              <X size={16} className="mr-1" /> Clear selection
            </button>
          )}
        </div>
        
        {/* Pokémon 2 Selector */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Select Second Pokémon</h2>
            <button
              onClick={setRandomSecondPokemon}
              className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
              aria-label="Random Pokémon"
            >
              <Shuffle size={20} />
            </button>
          </div>
          <div className="relative">
            <select
              value={pokemon2Id || ''}
              onChange={(e) => setPokemon2Id(Number(e.target.value) || null)}
              className="block w-full p-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Pokémon</option>
              {allPokemon.map(pokemon => (
                <option key={pokemon.id} value={pokemon.id}>
                  #{String(pokemon.id).padStart(3, '0')} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          
          {pokemon2Id && (
            <button
              onClick={() => setPokemon2Id(null)}
              className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center"
            >
              <X size={16} className="mr-1" /> Clear selection
            </button>
          )}
        </div>
      </div>
      
      {/* Comparison Results */}
      {pokemon1 && pokemon2 ? (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-200">
            {/* Pokémon 1 Header */}
            <div className="p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-200">
              <img
                src={pokemon1.sprites.other['official-artwork'].front_default || pokemon1.sprites.front_default}
                alt={pokemon1.name}
                className="h-32 w-32 object-contain"
              />
              <h3 className="text-xl font-bold capitalize mt-3">{pokemon1.name}</h3>
              <div className="text-sm text-gray-500 mb-2">#{String(pokemon1.id).padStart(3, '0')}</div>
              <div className="flex flex-wrap justify-center gap-2">
                {pokemon1.types.map(typeInfo => (
                  <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name} />
                ))}
              </div>
            </div>
            
            {/* Pokémon 2 Header */}
            <div className="p-6 flex flex-col items-center">
              <img
                src={pokemon2.sprites.other['official-artwork'].front_default || pokemon2.sprites.front_default}
                alt={pokemon2.name}
                className="h-32 w-32 object-contain"
              />
              <h3 className="text-xl font-bold capitalize mt-3">{pokemon2.name}</h3>
              <div className="text-sm text-gray-500 mb-2">#{String(pokemon2.id).padStart(3, '0')}</div>
              <div className="flex flex-wrap justify-center gap-2">
                {pokemon2.types.map(typeInfo => (
                  <TypeBadge key={typeInfo.type.name} type={typeInfo.type.name} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Stats Comparison */}
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Stats Comparison</h3>
            
            <div className="space-y-6">
              {/* HP Comparison */}
              <StatComparison
                statName="HP"
                pokemon1={pokemon1}
                pokemon2={pokemon2}
                statKey="hp"
                getStatValue={getStatValue}
                getStatBarWidth={getStatBarWidth}
                getComparisonPercentage={getComparisonPercentage}
              />
              
              {/* Attack Comparison */}
              <StatComparison
                statName="Attack"
                pokemon1={pokemon1}
                pokemon2={pokemon2}
                statKey="attack"
                getStatValue={getStatValue}
                getStatBarWidth={getStatBarWidth}
                getComparisonPercentage={getComparisonPercentage}
              />
              
              {/* Defense Comparison */}
              <StatComparison
                statName="Defense"
                pokemon1={pokemon1}
                pokemon2={pokemon2}
                statKey="defense"
                getStatValue={getStatValue}
                getStatBarWidth={getStatBarWidth}
                getComparisonPercentage={getComparisonPercentage}
              />
              
              {/* Special Attack Comparison */}
              <StatComparison
                statName="Special Attack"
                pokemon1={pokemon1}
                pokemon2={pokemon2}
                statKey="special-attack"
                getStatValue={getStatValue}
                getStatBarWidth={getStatBarWidth}
                getComparisonPercentage={getComparisonPercentage}
              />
              
              {/* Special Defense Comparison */}
              <StatComparison
                statName="Special Defense"
                pokemon1={pokemon1}
                pokemon2={pokemon2}
                statKey="special-defense"
                getStatValue={getStatValue}
                getStatBarWidth={getStatBarWidth}
                getComparisonPercentage={getComparisonPercentage}
              />
              
              {/* Speed Comparison */}
              <StatComparison
                statName="Speed"
                pokemon1={pokemon1}
                pokemon2={pokemon2}
                statKey="speed"
                getStatValue={getStatValue}
                getStatBarWidth={getStatBarWidth}
                getComparisonPercentage={getComparisonPercentage}
              />
              
              {/* Total Stats */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-md font-semibold mb-3">Total</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Pokémon 1 Total */}
                  <div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {pokemon1.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {pokemon1.name}
                      </div>
                    </div>
                  </div>
                  
                  {/* Difference */}
                  <div className="text-center">
                    <div className="text-lg">
                      Difference:
                      <span className="font-bold ml-2">
                        {Math.abs(
                          pokemon1.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0) -
                          pokemon2.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)
                        )}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getComparisonPercentage(
                        pokemon1.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0),
                        pokemon2.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)
                      )} difference
                    </div>
                  </div>
                  
                  {/* Pokémon 2 Total */}
                  <div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {pokemon2.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {pokemon2.name}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Select two Pokémon to compare their stats
          </h3>
          <p className="text-blue-600">
            Choose one Pokémon in each dropdown above or use the random button to see a detailed comparison.
          </p>
        </div>
      )}
    </div>
  );
};

// Stat comparison component
interface StatComparisonProps {
  statName: string;
  pokemon1: any;
  pokemon2: any;
  statKey: string;
  getStatValue: (pokemon: any, statName: string) => number;
  getStatBarWidth: (value: number, statName: string) => string;
  getComparisonPercentage: (value1: number, value2: number) => string;
}

const StatComparison: React.FC<StatComparisonProps> = ({
  statName,
  pokemon1,
  pokemon2,
  statKey,
  getStatValue,
  getStatBarWidth,
  getComparisonPercentage,
}) => {
  const pokemon1Value = getStatValue(pokemon1, statKey);
  const pokemon2Value = getStatValue(pokemon2, statKey);
  const pokemon1BarWidth = getStatBarWidth(pokemon1Value, statKey);
  const pokemon2BarWidth = getStatBarWidth(pokemon2Value, statKey);
  const difference = Math.abs(pokemon1Value - pokemon2Value);
  const percentDifference = getComparisonPercentage(pokemon1Value, pokemon2Value);
  const pokemon1IsHigher = pokemon1Value > pokemon2Value;
  const pokemon2IsHigher = pokemon2Value > pokemon1Value;
  
  return (
    <div>
      <h4 className="text-md font-semibold mb-3">{statName}</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pokémon 1 Stat */}
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-sm text-gray-700 capitalize">{pokemon1.name}</span>
            <span className={`text-sm font-medium ${pokemon1IsHigher ? 'text-green-600' : ''}`}>
              {pokemon1Value}
              {pokemon1IsHigher && <span className="ml-1">▲</span>}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${pokemon1IsHigher ? 'bg-green-500' : pokemon2IsHigher ? 'bg-gray-400' : 'bg-blue-500'}`}
              style={{ width: pokemon1BarWidth }}
            ></div>
          </div>
        </div>
        
        {/* Difference */}
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm">Difference: <span className="font-bold">{difference}</span></div>
            <div className="text-xs text-gray-500">{percentDifference}</div>
          </div>
        </div>
        
        {/* Pokémon 2 Stat */}
        <div>
          <div className="mb-1 flex justify-between">
            <span className="text-sm text-gray-700 capitalize">{pokemon2.name}</span>
            <span className={`text-sm font-medium ${pokemon2IsHigher ? 'text-green-600' : ''}`}>
              {pokemon2Value}
              {pokemon2IsHigher && <span className="ml-1">▲</span>}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full ${pokemon2IsHigher ? 'bg-green-500' : pokemon1IsHigher ? 'bg-gray-400' : 'bg-blue-500'}`}
              style={{ width: pokemon2BarWidth }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCompare;