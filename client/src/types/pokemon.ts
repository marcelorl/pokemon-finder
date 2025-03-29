export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonTypeResponse {
  pokemon: {
    pokemon: PokemonListItem;
  }[];
}

export interface PokemonBasicInfo {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface PokemonBasic {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
    slot: number;
  }[];
}

export interface PokemonDetail extends PokemonBasic {
  height: number;
  weight: number;
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
    is_hidden: boolean;
  }[];
}

export interface SearchFilters {
  name: string;
  type: string;
}

export interface SearchHistoryItem {
  term: string;
  type: string;
  timestamp: string;
}
