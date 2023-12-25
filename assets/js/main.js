const maxRecords = 5;
let limit = 3;
let offset = 0;
const loadMoreButton = document.getElementById("load-more-button");

async function loadPokemons(offset, limit) {
  const pokemonList = document.getElementById("pokemon-list");
  const pokemons = await pokeAPI.getPokemons(offset, limit);

  const newHTML = pokemons.map(convertPokemonToHTML).join("");
  pokemonList.innerHTML += newHTML;

  const pokemonCards = document.getElementsByClassName("pokemon");
  for (let index = 0; index < pokemonCards.length; index++) {
    pokemonCards[index].addEventListener("click", (event) => openModal(event));
  }
}

function convertPokemonToHTML(pokemon) {
  const { name, number, types, image } = pokemon;
  return `
          <li class="pokemon ${types[0]}" id="${number}">
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
  const qtdRecordsNextPage = offset + limit;

  if (qtdRecordsNextPage >= maxRecords) {
    limit = maxRecords - limit;
    loadMoreButton.parentElement.removeChild(loadMoreButton);
  }
  loadPokemons(offset, limit);
});

async function openModal(event) {
  const pokemonID = event.currentTarget.id;
  const pokemon = await pokeAPI.getPokemonDetails(null, pokemonID);

  const { name, number, types, image, abilities } = pokemon;

  const modal = document.getElementById("modal");
  modal.style.display = "block";

  modal.lastElementChild.innerHTML = `
    <section id="image-detail" class="${types[0]}">
      <picture id="main-type-icon">
        <img src="./assets/img/icons/${types[0]}.svg" alt="${types[0]}" />
      </picture>
      <picture id="pokemon-image">
        <img src="${image}" alt="${name}" />
      </picture>
    </section>
    
    <section id="info-detail">
      <h2 class="name">${name} #${number}</h2>
      ${abilities
        .map((ability) => {
          return `<h3 class="ability">${ability.name}</h3>
                <p class="ability-description">${ability.description}</p>`;
        })
        .join("")}

      <div class="type-icons">
      ${types
        .map((type) => {
          return `<picture class="type">
                    <img src="./assets/img/icons/${type}.svg" alt="${type}" />
                  </picture>`;
        })
        .join("")}    
      </div>
    </section>`;

  modal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}
