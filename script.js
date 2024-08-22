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