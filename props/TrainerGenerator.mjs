export class TrainerGenerator {
    name = 'Trainer';
    team = {
        pokemon1: [],
        pokemon2: [],
        pokemon3: [],
        pokemon4: [],
        pokemon5: [],
        pokemon6: [],
    };
    trainerClass;

    maxEvs = 510;
    maxEvsPerStat = 252;
    englishLanguage = 7;

    constructor(generator, pokebank, trainerName, gender = null) {
        this.name = trainerName;

        // Build Team
        for (const teammate in this.team) {
            let localPokemon = pokebank.pokemons[this.#generatePokemonId(generator, pokebank)];

            pokebank.pokedexApi.getPokemonByName(localPokemon.entry_number)
                .then((pokemon) => {
                    pokebank.pokedexApi.getPokemonSpeciesByName(localPokemon.entry_number)
                        .then(async (pokemonSpecies) => {
                            this.team[teammate] = await this.#generateShowdownData({...pokemon, ...pokemonSpecies}, generator, pokebank);
                        })
                        .catch((error) => {
                            // Todo : I'll handle errors later i'm eepy
                        })
                    ;
                })
                .catch((error) => {
                    // Todo : I'll handle errors later i'm eepy
                })
            ;
        }

        // Build TrainerClass
        // todo
    }

    #generatePokemonId(generator, pokebank) {
        return Math.floor(generator.random() * pokebank.pokemonCount + 1);
    }

    async #generateShowdownData(pokemon, generator, pokebank) {
        return new Promise((resolve, reject) => {
            pokemon.showdownData = {
                ability: '',
                moves: [],
            };

            const abilityPromise = new Promise((resolve, reject) => {
                pokebank
                    .pokedexApi
                    .getAbilityByName(pokemon.abilities[Math.floor(generator.random() * pokemon.abilities.length)].ability.name)
                    .then(ability => {
                        pokemon.showdownData.ability = ability.names[this.englishLanguage].name;

                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    })
                ;
            });

            return Promise
                .all([abilityPromise])
                .then(() => {
                    console.log(pokemon);
                    resolve(pokemon);
                })
            ;
        });
    }

    exportInShowdownFormat() {

    }
}