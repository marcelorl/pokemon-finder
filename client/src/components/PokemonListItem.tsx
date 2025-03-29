import { PokemonBasicInfo, PokemonListItem as PokemonListItemType } from '@/types/pokemon';

interface PokemonListItemProps {
  pokemon: PokemonBasicInfo;
  pokemonListItem: PokemonListItemType;
  onClick: (pokemonId: number) => void;
}

export const PokemonListItem = ({ pokemon, pokemonListItem, onClick }: PokemonListItemProps) => {
  const handleClick = () => {
    onClick(pokemon.id);
  };

  return (
    <div 
      className="flex items-center p-2 border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={handleClick}
    >
      <img 
        src={pokemon.image} 
        alt={pokemon.name} 
        className="w-8 h-8 mr-2"
        loading="lazy"
      />
      
      <div className="flex-1">
        <h3 className="text-sm font-medium text-gray-800 capitalize">{pokemon.name}</h3>
      </div>
      
      <div className="text-xs text-gray-400">#{pokemon.id}</div>
    </div>
  );
};