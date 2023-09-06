
const pokeApi = {};

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.name = pokeDetail.name
    pokemon.id = pokeDetail.id
    pokemon.photo = pokeDetail.sprites.other["official-artwork"].front_default

    pokemon.height = pokeDetail.height;
    pokemon.weight = pokeDetail.weight;

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    const stats = pokeDetail.stats.map((statSlot) => `${statSlot.stat.name.replace('-',' ')}: ${statSlot.base_stat}`)

    stats.push(`Height: ${pokeDetail.height}`)
    stats.push(`Weight: ${pokeDetail.weight}`)

    pokemon.stats = stats;

    return pokemon
}


pokeApi.getPokemonDetails = (pokemon) =>{
    return fetch(pokemon.url)
            .then((response) => response.json())
            .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) =>{
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    return fetch(url)
            .then((response) => response.json())
            .then((jsonBody) => jsonBody.results)
            .then((pokemons) => pokemons.map(pokeApi.getPokemonDetails))
            .then((detailRequest) => Promise.all(detailRequest))
            .then((pokemonDetails) => pokemonDetails)
            .catch((err) => console.error(err))
}
