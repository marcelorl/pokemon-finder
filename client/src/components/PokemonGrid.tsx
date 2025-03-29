import { useState } from 'react';
import { PokemonBasicInfo, PokemonListItem as PokemonListItemType } from '@/types/pokemon';
import { PokemonCard } from './PokemonCard';
import { PokemonListItem } from './PokemonListItem';
import { Pagination } from './Pagination';

interface PokemonGridProps {
  pokemon: PokemonBasicInfo[];
  pokemonListItems: PokemonListItemType[];
  isLoading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  totalCount: number;
  onPokemonSelect: (pokemonId: number, pokemonName: string) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

export const PokemonGrid = ({ 
  pokemon, 
  pokemonListItems,
  isLoading, 
  error, 
  page, 
  totalPages, 
  totalCount,
  onPokemonSelect,
  onNextPage,
  onPrevPage,
}: PokemonGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handlePokemonSelect = (pokemonId: number) => {
    const selectedPokemon = pokemon.find(p => p.id === pokemonId);
    if (selectedPokemon) {
      onPokemonSelect(pokemonId, selectedPokemon.name);
    }
  };

  return (
    <div className="lg:w-3/4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Pokémon List</h2>
          
          {/* View Mode Toggle */}
          <div className="flex border rounded overflow-hidden">
            <button
              className={`px-3 py-1 flex items-center text-sm ${viewMode === 'grid' 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              className={`px-3 py-1 flex items-center text-sm ${viewMode === 'list' 
                ? 'bg-gray-200 text-gray-800' 
                : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-500 rounded-full mb-4 animate-spin"></div>
            <p className="text-gray-500">Loading Pokémon...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="py-20 text-center">
            <div className="text-red-500 text-4xl mb-3">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-4">{error.message || 'Unable to load Pokémon data. Please try again later.'}</p>
            <button 
              className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-6 rounded-md transition duration-200 font-medium"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        )}

        {/* No Results State */}
        {!isLoading && !error && pokemon.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-gray-400 text-4xl mb-3">
              <i className="fas fa-search"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Pokémon Found</h3>
            <p className="text-gray-600">Try a different search term or filter.</p>
          </div>
        )}

        {/* Pokemon List/Grid View */}
        {!isLoading && !error && pokemon.length > 0 && (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {pokemon.map((p, index) => (
                <PokemonCard 
                  key={p.id} 
                  pokemon={p}
                  pokemonListItem={pokemonListItems[index]} 
                  onClick={handlePokemonSelect} 
                />
              ))}
            </div>
          ) : (
            <div className="border rounded overflow-hidden">
              {pokemon.map((p, index) => (
                <PokemonListItem
                  key={p.id}
                  pokemon={p}
                  pokemonListItem={pokemonListItems[index]}
                  onClick={handlePokemonSelect}
                />
              ))}
            </div>
          )
        )}
        
        {/* Pagination - Only show if we have results */}
        {!isLoading && !error && pokemon.length > 0 && (
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPrevPage={onPrevPage}
              onNextPage={onNextPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};
