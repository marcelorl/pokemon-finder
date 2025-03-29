import { useForm } from 'react-hook-form';
import { SearchFilters } from '@/types/pokemon';

interface SearchFormProps {
  onSearch: (filters: SearchFilters) => void;
  defaultValues?: SearchFilters;
}

export const SearchForm = ({ onSearch, defaultValues = { name: '', type: 'all' } }: SearchFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFilters>({
    defaultValues,
  });

  const onSubmit = (data: SearchFilters) => {
    const normalizedData: SearchFilters = {
      name: data.name.trim(),
      type: data.type
    };
    onSearch(normalizedData);
  };

  const pokemonTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'normal', label: 'Normal' },
    { value: 'fire', label: 'Fire' },
    { value: 'water', label: 'Water' },
    { value: 'grass', label: 'Grass' },
    { value: 'electric', label: 'Electric' },
    { value: 'ice', label: 'Ice' },
    { value: 'fighting', label: 'Fighting' },
    { value: 'poison', label: 'Poison' },
    { value: 'ground', label: 'Ground' },
    { value: 'flying', label: 'Flying' },
    { value: 'psychic', label: 'Psychic' },
    { value: 'bug', label: 'Bug' },
    { value: 'rock', label: 'Rock' },
    { value: 'ghost', label: 'Ghost' },
    { value: 'dark', label: 'Dark' },
    { value: 'dragon', label: 'Dragon' },
    { value: 'steel', label: 'Steel' },
    { value: 'fairy', label: 'Fairy' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4 space-y-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Search Pokémon
          </label>
          <div className="relative">
            <input
              id="name"
              type="text"
              placeholder="Enter a name..."
              {...register('name')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Type
          </label>
          <select 
            id="type"
            {...register('type')}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            {pokemonTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-200 font-medium"
        >
          Search
        </button>
      </form>
    </div>
  );
};
