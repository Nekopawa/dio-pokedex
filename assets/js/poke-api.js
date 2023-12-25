const pokeAPI = {};

async function getPokemonList(url) {
  let pokemonList = await (await fetch(url)).json();
  return pokemonList.results;
}

pokeAPI.getPokemonDetails = async (url, id = 0) => {
  if (!url) {
    url = "https://pokeapi.co/api/v2/pokemon/" + id;
  }

  const result = await (await fetch(url)).json();
  const {
    name,
    types,
    id: number,
    sprites: {
      other: {
        dream_world: { front_default: image },
      },
    },
    abilities,
  } = result;

  const pokemon = new Pokemon();
  pokemon.name = name;
  pokemon.number = number;
  pokemon.types = types.map((type) => type.type.name);
  pokemon.image = image;

  pokemon.abilities = await getAbilities(abilities);

  return pokemon;
};

async function getAbilities(abilities) {
  const result = [];

  return await Promise.all(
    abilities.map(async (ability) => {
      const { name, url } = ability.ability;
      const descriptions = await (await fetch(url)).json();

      //get the english version
      const description = descriptions.effect_entries.find(
        (item) => item.language.name === "en"
      );

      return new Ability(name, description.short_effect);
    })
  );
}

pokeAPI.getPokemons = async (offset = 0, limit = 5) => {
  const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;
  const pokemonList = await getPokemonList(url);
  return await Promise.all(
    pokemonList.map((pokemon) => pokeAPI.getPokemonDetails(pokemon.url))
  );
};
