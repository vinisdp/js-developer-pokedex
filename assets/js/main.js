const loadMoreButton = document.getElementById('loadMoreButton');
const closeButton = document.getElementById('closeButton');
const divStatus= document.getElementById("div-diagonal");
const pokeInfo = document.getElementById("pokeInfo");
const pokeNumber = document.getElementById("pokeNumber");
const pokeName = document.getElementById("pokeName");
const pokeTypes = document.getElementById("pokeTypes");
const pokeImg = document.getElementById("pokeImg");
const pokeStatus = document.getElementById("pokeStatus");
const overlay = document.getElementById("overlay");
const pokemonOl = document.getElementById('pokemonList');
VanillaTilt.init(pokeInfo,{
    max: 25,
    speed:400,
    glare: true,
    "max-glare": .25,
}
 );

const limit = 100;
let offset = 0;
let pokeType;

const maxRecords = 891;

function convertPokemonToHTML(pokemon) {
    return `<li class="pokemon ${pokemon.type}" id="pokemon" onclick="getPokemon(${pokemon.id})">
                <span class="number">#${pokemon.id}</span>
                <span class="name">${pokemon.name}</span>

                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                    <img src=${pokemon.photo}
                        alt=${pokemon.name}>
                </div>
            </li>`
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit)
        .then((pokemons = []) => {
            pokemonOl.innerHTML += pokemons.map(convertPokemonToHTML).join('')
        })
}

loadPokemonItens(offset,limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;

    const qtdRecordNextPage = offset + limit;

    if (qtdRecordNextPage >= maxRecords) {
        const newLimit =  maxRecords - offset;
        loadPokemonItens(offset, newLimit);
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }    
})
pokeApi.getPokemons()
    .then((pokemonList = []) =>  {
        pokemonOl.innerHTML += pokemonList.map(convertPokemonToHTML).join('')
    })
    .catch((err) => console.error(err));

    function showPokemonCard() {
    pokeInfo.style.opacity = 1;
    pokeInfo.style.pointerEvents = 'auto';
    overlay.style.opacity = 1;
    overlay.style.pointerEvents = 'auto';
}

function hidePokemonCard(){
    pokeInfo.style.opacity = 0;
    pokeInfo.style.pointerEvents = 'none';
    overlay.style.opacity = 0;
    overlay.style.pointerEvents = 'none';
    pokeName.classList.remove(pokeType);
    pokeNumber.classList.remove(pokeType);
    pokeStatus.classList.remove(pokeType);
    divStatus.classList.remove(pokeType);
}

function closeOverlay() {
    if (overlay.style.opacity === '1') {
        hidePokemonCard();
    }
}

closeButton.addEventListener('click', () => {
    hidePokemonCard();
})

function pokeUpdate(pokemon) {
    
    pokemon = pokemon[0];

    pokeNumber.textContent = `#${pokemon.id}`
    pokeName.textContent = `${pokemon.name}`
    pokeImg.src = pokemon.photo
    pokeType = pokemon.type;
    pokeName.classList.add(pokeType);
    pokeNumber.classList.add(pokeType);
    pokeStatus.classList.add(pokeType);
    divStatus.classList.add(pokeType);
    pokeTypes.innerHTML = '';
    pokeStatus.innerHTML = '';

    pokemon.types.map((type) => {
        const li = document.createElement("li")
        li.classList.add('type')
        li.classList.add(type)
        li.appendChild(document.createTextNode(type))
        pokeTypes.appendChild(li);
    })

    pokemon.stats.map((stat) => {
        const li = document.createElement("li")
        li.appendChild(document.createTextNode(stat))
        pokeStatus.appendChild(li);
    })


}

function getPokemon(id){
    pokeApi.getPokemons(id-1, 1)
    .then(pokeUpdate)
    .then(showPokemonCard);
}