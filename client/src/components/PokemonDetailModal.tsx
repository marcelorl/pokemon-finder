import { useQuery } from '@tanstack/react-query';
import { PokemonDetail } from '@/types/pokemon';
import { useEffect } from 'react';

interface PokemonDetailModalProps {
  pokemonId: number | null;
  pokemonName: string;
  open: boolean;
  onClose: () => void;
}

export const PokemonDetailModal = ({ pokemonId, pokemonName, open, onClose }: PokemonDetailModalProps) => {
  const { data: pokemonDetail, isLoading } = useQuery({
    queryKey: ['pokemonDetail', pokemonId],
    queryFn: async () => {
      if (!pokemonId) return null;
      
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      if (!response.ok) throw new Error(`Failed to fetch details for Pokemon #${pokemonId}`);
      return await response.json() as PokemonDetail;
    },
    enabled: !!pokemonId && open,
  });

  if (!open || !pokemonId) return null;

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-xl font-bold text-gray-800 capitalize">{pokemonName}</h2>
            <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
          </div>

          {isLoading ? (
              <div className="py-10 flex flex-col items-center justify-center">
                <div
                    className="w-12 h-12 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin mb-4"></div>
                <div className="text-gray-600">Loading...</div>
              </div>
          ) : pokemonDetail ? (
              <div className="p-4">
                <div className="flex justify-center mb-4">
                  <img
                      src={pokemonDetail.sprites.other['official-artwork'].front_default || pokemonDetail.sprites.front_default}
                      alt={pokemonDetail.name}
                      className="w-48 h-48 object-contain"
                  />
                </div>

                <table className="w-full border-collapse mb-4">
                  <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium">ID</td>
                    <td className="py-2 px-4">{pokemonDetail.id}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium">Types</td>
                    <td className="py-2 px-4 capitalize">
                      {pokemonDetail.types.map(t => t.type.name).join(', ')}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium">Height</td>
                    <td className="py-2 px-4">{(pokemonDetail.height / 10).toFixed(1)}m</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-medium">Weight</td>
                    <td className="py-2 px-4">{(pokemonDetail.weight / 10).toFixed(1)}kg</td>
                  </tr>

                  {/* Stats */}
                  {pokemonDetail.stats.map(stat => (
                      <tr key={stat.stat.name} className="border-b">
                        <td className="py-2 px-4 font-medium capitalize">
                          {stat.stat.name.replace('-', ' ')}
                        </td>
                        <td className="py-2 px-4">{stat.base_stat}</td>
                      </tr>
                  ))}

                  {/* Abilities */}
                  <tr>
                    <td className="py-2 px-4 font-medium">Abilities</td>
                    <td className="py-2 px-4 capitalize">
                      {pokemonDetail.abilities.map(a =>
                          a.is_hidden
                              ? `${a.ability.name.replace('-', ' ')} (Hidden)`
                              : a.ability.name.replace('-', ' ')
                      ).join(', ')}
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
          ) : (
              <div className="py-10 text-center text-gray-500">
                Failed to load Pokémon details.
              </div>
          )}
        </div>
      </div>
  );
};
