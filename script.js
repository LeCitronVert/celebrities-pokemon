import {getSeededRng} from "./scripts/SeededRng.mjs";
import {PokemonBank} from "./scripts/PokemonBank.mjs";
import {TrainerGenerator} from "./scripts/TrainerGenerator.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const pokebank = new PokemonBank(new Pokedex.Pokedex({
        cacheImages: true,
    }));

    document.querySelector('.trainer-copy-showdown-team')?.addEventListener('click', (e) => {
        e.preventDefault();

        navigator.clipboard.writeText(e.currentTarget.dataset.showdownData);
    });

    document
        .querySelector('#celebrity-form')
        ?.addEventListener('submit', (event) => {
            event.preventDefault();

            generatePokemonTrainer(pokebank);
        })
    ;

    document.addEventListener('trainerGenerated', (event) => {
        displayTrainer(event.detail.trainer);
    });
})

function generatePokemonTrainer (pokebank, name = null) {
    if (null === name) {
        name = document
            .querySelector('#celebrity-form .name').value
            .trim()
        ;
    }

    const generator = getSeededRng(convertLetterToNumber(name
        .toLowerCase()
    ));
    const trainer = new TrainerGenerator(generator, pokebank, name);
}

function displayTrainer (trainer) {
    const trainerImage = document.querySelector('.trainer-image');
    const trainerClass = document.querySelector('.trainer-class');
    const trainerName = document.querySelector('.trainer-name');

    const copyShowdownButton = document.querySelector('.trainer-copy-showdown-team');
    copyShowdownButton.dataset.showdownData = trainer.exportInShowdownFormat();

    trainerClass.textContent = trainer.trainerClass;
    trainerName.textContent = trainer.name;

    displayPokemons(trainer);
}

function displayPokemons (trainer) {
    const trainerTeam = document.querySelector('.trainer-team');
    let pokemonCount = 1;
    Array
        .from(trainerTeam.children)
        .forEach((pokemonElement) => {
            const pokemon = trainer.team['pokemon'+pokemonCount];
            pokemonCount++;

            if (!pokemon.hasOwnProperty('showdownData')) {
                return;
            }

            pokemonElement.querySelector('.pokemon-name').textContent = pokemon.showdownData.name;
            pokemonElement.querySelector('.pokemon-ability').textContent = pokemon.showdownData.ability;
            pokemonElement.querySelector('.pokemon-item').textContent = pokemon.showdownData.heldItem;

            pokemonElement.querySelector('.pokemon-image').src = pokemon.sprites.front_default;

            for (const ev in pokemon.showdownData.evs) {
                pokemonElement.querySelector(`.pokemon-ev[data-ev="${ev.toLowerCase()}"]`).textContent = pokemon.showdownData.evs[ev];
            }

            pokemon.showdownData.moves.forEach((move, index) => {
                pokemonElement.querySelector(`.pokemon-move[data-move="${index+1}"]`).textContent = move;
            });

        })
    ;
}

/** stolen from : https://stackoverflow.com/questions/22624379/how-to-convert-letters-to-numbers-with-javascript **/
function convertLetterToNumber(str) {
    const start = 96 // "a".charCodeAt(0) - 1
    const len = str.length;

    return [...str.toLowerCase()].reduce((out, char, pos) => {
        const val = char.charCodeAt(0) - start
        const pow = Math.pow(26, len - pos - 1);
        return out + val * pow
    }, 0);
}