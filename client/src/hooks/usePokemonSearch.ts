import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  PokemonListResponse, 
  PokemonTypeResponse, 
  SearchFilters, 
  PokemonListItem,
  PokemonBasicInfo
} from '@/types/pokemon';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const ITEMS_PER_PAGE = 24;

const getIdFromUrl = (url: string): number => {
  const parts = url.split('/');
  return parseInt(parts[parts.length - 2]);
};

const getImageUrl = (id: number): string => {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
};

export const usePokemonSearch = () => {
  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    name: '',
    type: 'all',
  });

  const [allPokemonList, setAllPokemonList] = useState<PokemonListItem[]>([]);

  useEffect(() => {
    setPage(1);
  }, [searchFilters]);

  const {
    data: pokemonListData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pokemonList', page, searchFilters.type, searchFilters.name],
    queryFn: async () => {
      let baseList: PokemonListItem[] = allPokemonList;

      if (baseList.length === 0) {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=1302`);
        if (!response.ok) throw new Error('Failed to fetch Pokemon list');
        const data = await response.json() as PokemonListResponse;
        baseList = data.results;
        setAllPokemonList(data.results);
      }

      // Apply type filter if needed
      if (searchFilters.type && searchFilters.type !== 'all') {
        const response = await fetch(`${POKEAPI_BASE_URL}/type/${searchFilters.type}`);
        if (!response.ok) throw new Error('Failed to fetch Pokemon by type');
        const data: PokemonTypeResponse = await response.json();

        const typeFilteredNames = new Set(data.pokemon.map(p => p.pokemon.name));
        baseList = baseList.filter(pokemon => typeFilteredNames.has(pokemon.name));
      }

      // Apply name filter if needed
      let filteredList = baseList;
      if (searchFilters.name) {
        const searchTerm = searchFilters.name.trim().toLowerCase();
        filteredList = baseList.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm)
        );
      }

      // Apply pagination
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const paginatedResults = filteredList.slice(startIndex, endIndex);

      return {
        count: filteredList.length,
        results: paginatedResults,
        next: endIndex < filteredList.length ? 'hasNext' : null,
        previous: page > 1 ? 'hasPrevious' : null,
      } as PokemonListResponse;
    },
  });

  const pokemonBasicInfo: PokemonBasicInfo[] = pokemonListData?.results.map(pokemon => {
    const id = getIdFromUrl(pokemon.url);
    return {
      id,
      name: pokemon.name,
      image: getImageUrl(id),
      types: []
    };
  }) || [];

  useEffect(() => {
    setPage(1);
  }, [searchFilters.type, searchFilters.name]);

  const totalPages = pokemonListData ? Math.ceil(pokemonListData.count / ITEMS_PER_PAGE) : 0;

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  return {
    pokemon: pokemonBasicInfo,
    pokemonListItems: pokemonListData?.results || [],
    isLoading,
    error,
    page,
    totalPages,
    totalCount: pokemonListData?.count || 0,
    searchFilters,
    handleSearch,
    handleNextPage,
    handlePrevPage,
  };
};
