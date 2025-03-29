import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import { useSearchHistory } from '../useSearchHistory';
import { SearchFilters } from '../../types/pokemon';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    store
  };
})();

// Replace global localStorage with mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
});

describe('useSearchHistory', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    vi.clearAllMocks();
  });

  it('initializes with empty history when localStorage is empty', () => {
    const { result } = renderHook(() => useSearchHistory());
    
    expect(result.current.searchHistory).toEqual([]);
    expect(mockLocalStorage.getItem).toHaveBeenCalledWith('pokemonSearchHistory');
  });

  it('initializes with history from localStorage', () => {
    const mockHistory = [
      { term: 'pikachu', type: 'electric', timestamp: '2023-03-15T10:30:00Z' }
    ];
    mockLocalStorage.setItem('pokemonSearchHistory', JSON.stringify(mockHistory));
    
    const { result } = renderHook(() => useSearchHistory());
    
    expect(result.current.searchHistory).toEqual(mockHistory);
  });

  it('adds new search to history', () => {
    const { result } = renderHook(() => useSearchHistory());
    
    // Add a search to history
    const filters: SearchFilters = { name: 'charizard', type: 'fire' };
    act(() => {
      result.current.addToHistory(filters);
    });
    
    // Check if history was updated
    expect(result.current.searchHistory.length).toBe(1);
    expect(result.current.searchHistory[0].term).toBe('charizard');
    expect(result.current.searchHistory[0].type).toBe('fire');
    
    // Check if localStorage was updated
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'pokemonSearchHistory',
      expect.any(String)
    );
  });

  it('clears history', () => {
    // Initialize with some history
    const mockHistory = [
      { term: 'pikachu', type: 'electric', timestamp: '2023-03-15T10:30:00Z' }
    ];
    mockLocalStorage.setItem('pokemonSearchHistory', JSON.stringify(mockHistory));
    
    const { result } = renderHook(() => useSearchHistory());
    
    // Clear history
    act(() => {
      result.current.clearHistory();
    });
    
    // Check if history was cleared
    expect(result.current.searchHistory).toEqual([]);
    
    // Check if localStorage was updated
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('pokemonSearchHistory');
  });

  it('limits history to a maximum number of items', () => {
    const { result } = renderHook(() => useSearchHistory());
    
    // Add multiple items to exceed the maximum limit
    for (let i = 0; i < 20; i++) {
      act(() => {
        result.current.addToHistory({ name: `pokemon-${i}`, type: '' });
      });
    }
    
    // Check if history was limited
    expect(result.current.searchHistory.length).toBeLessThanOrEqual(10);
    
    // The latest items should be at the beginning
    expect(result.current.searchHistory[0].term).toBe('pokemon-19');
  });

  it('does not add duplicate searches', () => {
    const { result } = renderHook(() => useSearchHistory());
    
    // Add a search
    const filters: SearchFilters = { name: 'charizard', type: 'fire' };
    
    act(() => {
      result.current.addToHistory(filters);
    });
    
    // Add the same search again
    act(() => {
      result.current.addToHistory(filters);
    });
    
    // Check if history still has only one entry
    expect(result.current.searchHistory.length).toBe(1);
  });
});