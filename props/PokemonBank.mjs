export class PokemonBank {
    pokemonCount;
    pokemons = [];
    pokedexApi;

    constructor(pokedex) {
        this.pokedexApi = pokedex;

        this.pokedexApi
            .getPokedexByName('national')
            .then(pokedex => {
                this.pokemonCount = pokedex.pokemon_entries.length;
                this.pokemons = pokedex.pokemon_entries;
            })
            .catch((error) => {
                // Todo : I'll handle errors later i'm eepy
            })
        ;
    }
}