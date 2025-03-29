import { useState } from 'react';
import { Header } from '@/components/Header';
import { SearchForm } from '@/components/SearchForm';
import { SearchHistory } from '@/components/SearchHistory';
import { PokemonGrid } from '@/components/PokemonGrid';
import { PokemonDetailModal } from '@/components/PokemonDetailModal';
import { usePokemonSearch } from '@/hooks/usePokemonSearch';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { SearchFilters } from '@/types/pokemon';

export default function Home() {
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
  const [selectedPokemonName, setSelectedPokemonName] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    pokemon, 
    pokemonListItems,
    isLoading, 
    error, 
    page, 
    totalPages, 
    totalCount,
    searchFilters,
    handleSearch,
    handleNextPage,
    handlePrevPage,
  } = usePokemonSearch();
  
  const { 
    searchHistory, 
    addToHistory, 
    clearHistory 
  } = useSearchHistory();

  const onPokemonSelect = (pokemonId: number, pokemonName: string) => {
    setSelectedPokemonId(pokemonId);
    setSelectedPokemonName(pokemonName);
    setIsModalOpen(true);
  };

  const onSearch = (filters: SearchFilters) => {
    handleSearch(filters);
    if (filters.name || (filters.type && filters.type !== 'all')) {
      addToHistory(filters);
    }
  };

  const onSelectHistory = (filters: SearchFilters) => {
    handleSearch(filters);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="lg:flex lg:gap-6">
          <div className="lg:w-1/4">
            <SearchForm 
              onSearch={onSearch} 
              defaultValues={searchFilters} 
            />
            
            <SearchHistory 
              history={searchHistory} 
              onClearHistory={clearHistory} 
              onSelectHistory={onSelectHistory} 
            />
          </div>
          
          <PokemonGrid 
            pokemon={pokemon}
            pokemonListItems={pokemonListItems} 
            isLoading={isLoading} 
            error={error as Error | null}
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            onPokemonSelect={onPokemonSelect}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
          />
        </div>
      </main>
      
      <PokemonDetailModal 
        pokemonId={selectedPokemonId} 
        pokemonName={selectedPokemonName}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
