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
    trainerClass = 'Pokémon Trainer';

    maxEvs = 510;
    maxEvsPerStat = 252;
    englishLanguage = 'en';

    constructor(generator, pokebank, trainerName, gender = null) {
        this.name = trainerName;
        let pokemonPromiseList = [];

        // Build Team
        for (const teammate in this.team) {
            let localPokemon = pokebank.pokemons[this.#generatePokemonId(generator, pokebank)];

            pokemonPromiseList.push(new Promise((resolve, reject) => {
                pokebank.pokedexApi.getPokemonByName(localPokemon.entry_number)
                    .then((pokemon) => {
                        pokebank.pokedexApi.getPokemonSpeciesByName(localPokemon.entry_number)
                            .then((pokemonSpecies) => {
                                this
                                    .#generateShowdownData({...pokemon, ...pokemonSpecies}, generator, pokebank, teammate)
                                    .then(() => { resolve(); })
                                ;
                            })
                            .catch((error) => {
                                // Todo : I'll handle errors later i'm eepy
                                reject();
                            })
                        ;
                    })
                    .catch((error) => {
                        // Todo : I'll handle errors later i'm eepy
                        reject();
                    })
                ;
            }));
        }

        // Build TrainerClass
        // todo

        Promise
            .all(pokemonPromiseList)
            .then(() => {
                document.dispatchEvent(new CustomEvent('trainerGenerated', {
                    detail: {
                        trainer: this,
                    }
                }));
            })
        ;
    }

    #generatePokemonId(generator, pokebank) {
        return Math.floor(generator.random() * pokebank.pokemonCount + 1);
    }

    #generateShowdownData(pokemon, generator, pokebank, teammate) {
        return new Promise((resolve, reject) => {
            pokemon.showdownData = {
                ability: '',
                moves: [
                    pokemon.moves[Math.floor(generator.random() * pokemon.moves.length)].move.name,
                    pokemon.moves[Math.floor(generator.random() * pokemon.moves.length)].move.name,
                    pokemon.moves[Math.floor(generator.random() * pokemon.moves.length)].move.name,
                    pokemon.moves[Math.floor(generator.random() * pokemon.moves.length)].move.name,
                ],
                heldItem: '',
                nature: '',
                evs: {
                    HP: 0,
                    Atk: 0,
                    Def: 0,
                    SpA: 0,
                    SpD: 0,
                    Spe: 0,
                },
                name: this.retrieveNameFromArray(pokemon.names, pokemon.name),
            };

            const abilityPromise = new Promise((resolve, reject) => {
                pokebank
                    .pokedexApi
                    .getAbilityByName(pokemon.abilities[Math.floor(generator.random() * pokemon.abilities.length)].ability.name)
                    .then(ability => {
                        pokemon.showdownData.ability = this.retrieveNameFromArray(ability.names, ability.name);

                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    })
                ;
            });

            const evsPromise = new Promise((resolve, reject) => {
                let remainingEvs = this.maxEvs;
                let evs = pokemon.showdownData.evs;

                let evKeys = Object.keys(evs);
                evKeys.sort(() => generator.random() - 0.5);

                evKeys.forEach((stat) => {
                    evs[stat] = Math.min(this.maxEvsPerStat, Math.floor(generator.random() * remainingEvs));
                    remainingEvs -= evs[stat];
                });

                pokemon.showdownData.evs = evs;

                resolve();
            });

            let movesPromises = [];
            pokemon.showdownData.moves.forEach((move, index) => {
                movesPromises.push(new Promise((resolve, reject) => {
                    pokebank
                        .pokedexApi
                        .getMoveByName(move)
                        .then(moveData => {
                            pokemon.showdownData.moves[index] = this.retrieveNameFromArray(moveData.names, moveData.name);
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        })
                    ;
                }));
            });

            return Promise
                .all([abilityPromise, evsPromise, ...movesPromises])
                .then(() => {
                    this.team[teammate] = pokemon;
                    resolve(pokemon);
                })
            ;
        });
    }

    exportInShowdownFormat() {
        let showdownString = '';

        for (const teammate in this.team) {
            const showdownData = this.team[teammate].showdownData;

            showdownString += `
                ${showdownData.name} ${showdownData.heldItem ? `@ ${showdownData.heldItem}` : ''}\n
                Ability: ${showdownData.ability}\n
                EVs: ${showdownData.evs.HP} HP / ${showdownData.evs.Atk} Atk / ${showdownData.evs.Def} Def / ${showdownData.evs.SpA} SpA / ${showdownData.evs.SpD} SpD / ${showdownData.evs.Spe} Spe\n
                ${showdownData.nature} Nature\n
                - ${showdownData.moves[0]}\n
                - ${showdownData.moves[1]}\n
                - ${showdownData.moves[2]}\n
                - ${showdownData.moves[3]}\n
                \n\n
            `;
        }

        return showdownString;
    }

    retrieveNameFromArray(nameArray, fallback = 'Unknown') {
        let foundName = fallback;

        nameArray
            .forEach(name => {
                if (name.language.name === this.englishLanguage) {
                    foundName = name.name;
                }
            })
        ;

        return foundName;
    }
}