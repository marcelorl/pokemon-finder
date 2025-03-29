import { useState, useEffect } from 'react';
import { SearchHistoryItem, SearchFilters } from '@/types/pokemon';

const STORAGE_KEY = 'pokemonSearchHistory';
const MAX_HISTORY_ITEMS = 10;

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse search history:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const addToHistory = (filters: SearchFilters) => {
    const { name, type } = filters;
    
    if (!name && !type) return;
    
    const timestamp = new Date().toLocaleString();
    const newItem: SearchHistoryItem = {
      term: name,
      type,
      timestamp,
    };
    
    const updatedHistory = [
      newItem,
      ...searchHistory.filter(
        item => !(item.term === name && item.type === type)
      ),
    ].slice(0, MAX_HISTORY_ITEMS);
    
    setSearchHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    searchHistory,
    addToHistory,
    clearHistory,
  };
};
