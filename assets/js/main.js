const maxRecords = 30;
let limit = 10;
let offset = 0;
const loadMoreButton = document.getElementById("load-more-button");

async function loadPokemons(offset, limit) {
  const pokemonList = document.getElementById("pokemon-list");
  const pokemons = await pokeAPI.getPokemons(offset, limit);

  const newHTML = pokemons.map(convertPokemonToHTML).join("");
  pokemonList.innerHTML += newHTML;
}

function convertPokemonToHTML(pokemon) {
  const { number, name, types, image } = pokemon;
  return `
          <li class="pokemon ${types[0]}">
            <span class="number">#${number}</span>
            <span class="name">${name}</span>

            <section class="detail">
              <ol class="types">
                ${types
                  .map((type) => `<li class="type ${type}">${type}</li>`)
                  .join("")}
              </ol>

              <picture class="image">
                <img
                  src="${image}"
                  alt="${name}"
                />
              </picture>
            </section>
          </li>
  `;
}

loadPokemons(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;

  if (offset >= maxRecords) {
    limit = offset - limit;
  }
  loadPokemons(offset, limit);
});
