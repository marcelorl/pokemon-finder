import { SearchHistoryItem, SearchFilters } from '@/types/pokemon';

interface SearchHistoryProps {
  history: SearchHistoryItem[];
  onClearHistory: () => void;
  onSelectHistory: (filters: SearchFilters) => void;
}

export const SearchHistory = ({ 
  history, 
  onClearHistory, 
  onSelectHistory 
}: SearchHistoryProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 lg:mb-0 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-gray-800">Search History</h2>
        <button
          onClick={onClearHistory}
          className="text-xs text-gray-500 hover:text-red-500 h-7 px-2"
        >
          Clear All
        </button>
      </div>
      
      {history.length > 0 ? (
        <div className="h-52 overflow-y-auto pr-1 space-y-1">
          {history.map((item, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-2 hover:bg-gray-50 rounded cursor-pointer border-b border-gray-100"
              onClick={() => onSelectHistory({ 
                name: item.term, 
                type: item.type 
              })}
            >
              <div>
                <span className="text-xs text-gray-800">
                  {item.term ? item.term : item.type ? `Type: ${item.type}` : 'All Pokémon'}
                </span>
                <p className="text-xs text-gray-500">{item.timestamp}</p>
              </div>
              <button
                className="text-gray-400 hover:text-red-500 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectHistory({ 
                    name: item.term, 
                    type: item.type 
                  });
                }}
              >
                ↺
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500 text-sm">
          No search history yet.
        </div>
      )}
    </div>
  );
};
