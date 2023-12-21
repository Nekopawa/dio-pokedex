const pokeAPI = {};

async function getPokemonList(url) {
  let pokemonList = await (await fetch(url)).json();
  return pokemonList.results;
}

async function getPokemonDetails(pokemonItem) {
  const result = await (await fetch(pokemonItem.url)).json();

  const {
    name,
    order: number,
    types,
    sprites: {
      other: {
        dream_world: { front_default: image },
      },
    },
  } = result;

  const pokemon = new Pokemon();
  pokemon.name = name;
  pokemon.number = number;
  pokemon.types = types.map((type) => type.type.name);
  pokemon.image = image;

  return pokemon;
}

pokeAPI.getPokemons = async (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  const pokemonList = await getPokemonList(url);
  return Promise.all(pokemonList.map(getPokemonDetails));
};
