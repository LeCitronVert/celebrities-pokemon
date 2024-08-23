export class PokemonBank {
    natures = [];
    pokemonCount;
    pokemons = [];
    pokedexApi;
    stats = [];

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

        this.pokedexApi
            .getNaturesList()
            .then(natures => {
                this.natures = natures.results;
            })
            .catch((error) => {
                // Todo : I'll handle errors later i'm eepy
            })
        ;

        this.pokedexApi
            .getStatsList()
            .then(stats => {
                this.stats = stats.results;
            })
            .catch((error) => {
                // Todo : I'll handle errors later i'm eepy
            })
        ;
    }
}