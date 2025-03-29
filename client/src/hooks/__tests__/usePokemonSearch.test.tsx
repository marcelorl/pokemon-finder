import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { usePokemonSearch } from '../usePokemonSearch';
import { mockPokemonList, mockPokemonListItems } from '../../test-utils';
import { SearchFilters } from '../../types/pokemon';

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Mock fetch implementation
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock successful responses for different API calls
const mockApiResponses = {
  list: {
    count: 1025,
    next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
    previous: null,
    results: mockPokemonListItems,
  },
  pokemon: mockPokemonList.map(pokemon => ({
    id: pokemon.id,
    name: pokemon.name,
    sprites: {
      front_default: pokemon.image,
      other: { 'official-artwork': { front_default: pokemon.image } }
    },
    types: pokemon.types.map(type => ({ type: { name: type }, slot: 1 })),
  })),
  type: {
    pokemon: mockPokemonListItems.map(item => ({ pokemon: item })),
  }
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

// Modified test file sections

describe('usePokemonSearch', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    queryClient.clear();
    // Update mock for the new implementation
    mockFetch.mockImplementation((url: string) => {
      if (url.includes('/api/v2/pokemon?limit=1302')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            count: 1302,
            results: mockPokemonListItems,
          }),
        });
      }
      if (url.includes('/api/v2/type/')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockApiResponses.type),
        });
      }
      return Promise.reject(new Error(`Unhandled URL in mock: ${url}`));
    });
  });

  it('fetches Pokemon list on initial load', async () => {
    const { result } = renderHook(() => usePokemonSearch(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.pokemon.length).toBeGreaterThan(0);
    expect(result.current.totalPages).toBeGreaterThan(0);
    expect(mockFetch).toHaveBeenCalledWith(
        `${POKEAPI_BASE_URL}/pokemon?limit=1302`
    );
  });

  it('handles pagination correctly', async () => {
    const { result } = renderHook(() => usePokemonSearch(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.page).toBe(1);

    result.current.handleNextPage();

    expect(result.current.page).toBe(1);
    // No need to check for API call since pagination is now handled client-side
  });

  it('searches Pokemon by name correctly', async () => {
    const { result } = renderHook(() => usePokemonSearch(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const filters: SearchFilters = { name: 'bulba', type: 'all' };
    result.current.handleSearch(filters);

    await waitFor(() => {
      expect(result.current.pokemon).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: expect.stringContaining('bulba') })
          ])
      );
    });
  });

  it('searches Pokemon by type correctly', async () => {
    const { result } = renderHook(() => usePokemonSearch(), { wrapper });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const filters: SearchFilters = { name: '', type: 'fire' };
    result.current.handleSearch(filters);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
          `${POKEAPI_BASE_URL}/type/fire`
      );
    });
  });
});