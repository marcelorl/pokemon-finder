import { PokemonBasicInfo, PokemonListItem } from '@/types/pokemon';

interface PokemonCardProps {
  pokemon: PokemonBasicInfo;
  pokemonListItem: PokemonListItem;
  onClick: (pokemonId: number) => void;
}

export const PokemonCard = ({ pokemon, pokemonListItem, onClick }: PokemonCardProps) => {
  const handleClick = () => {
    onClick(pokemon.id);
  };

  return (
    <div 
      className="bg-gray-50 rounded-lg hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <div className="p-2 text-center">
        <img 
          src={pokemon.image} 
          alt={pokemon.name} 
          className="w-16 h-16 mx-auto"
          loading="lazy"
        />
        <h3 className="mt-1 text-xs font-semibold text-gray-800 capitalize">{pokemon.name}</h3>
        <p className="text-xs text-gray-500">#{pokemon.id}</p>
      </div>
    </div>
  );
};
