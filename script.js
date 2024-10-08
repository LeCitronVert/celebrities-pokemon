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

    enableObsMode(pokebank);
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
    let trainerNameString = trainer.name;
    if (16 < trainerNameString.length) {
        trainerNameString = trainerNameString.substring(0, 16) + '.';
    }
    trainerName.textContent = trainerNameString;
    trainerImage.src = './sprites/' + trainer.trainerSprite;

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

            pokemonElement.querySelector('.pokemon-image').src = pokemon.sprites.front_default;

            for (const ev in pokemon.showdownData.evs) {
                pokemonElement.querySelector(`.pokemon-ev[data-ev="${ev.toLowerCase()}"]`).textContent = pokemon.showdownData.evs[ev];
            }

            pokemon.showdownData.moves.forEach((move, index) => {
                pokemonElement.querySelector(`.pokemon-move[data-move="${index+1}"]`).textContent = move;
            });

            let natureElement = pokemonElement.querySelector('.pokemon-nature');
            natureElement.textContent = pokemon.showdownData.nature;
            natureElement.dataset.plusStat = pokemon.showdownData.naturePlus;
            natureElement.dataset.minusStat = pokemon.showdownData.natureMinus;

            pokemonElement.querySelector('.pokemon-item-name').textContent = pokemon.showdownData.heldItem;
            pokemonElement.querySelector('.pokemon-item-image').src = pokemon.showdownData.heldItemSprite;
        })
    ;
}

function enableObsMode (pokebank) {
    const search = findGetParameter('obs');

    if (!search) {
        return;
    }

    const obsStylesheet = document.createElement('link');
    obsStylesheet.type = 'text/css';
    obsStylesheet.href = './style/obs.css';
    obsStylesheet.rel = 'stylesheet';
    document.getElementsByTagName('head')[0].appendChild(obsStylesheet);

    const obsBg = findGetParameter('obs-bg');
    if (obsBg) {
        document.body.style.backgroundColor = obsBg;
    }

    // todo : lame girl's hack, need to find a way to wait for the pokedex to be loaded
    setTimeout(() => {
        generatePokemonTrainer(pokebank, search);
    }, 1000);
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

function findGetParameter(parameterName) {
    let result = null, tmp = [];

    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        })
    ;

    return result;
}