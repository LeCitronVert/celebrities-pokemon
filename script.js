import {getSeededRng} from "./props/SeededRng.mjs";
import {PokemonBank} from "./props/PokemonBank.mjs";
import {TrainerGenerator} from "./props/TrainerGenerator.mjs";

document.addEventListener("DOMContentLoaded", () => {
    const pokebank = new PokemonBank(new Pokedex.Pokedex({
        cacheImages: true,
    }));

    document
        .querySelector('#celebrity-form')
        ?.addEventListener('submit', (event) => {
            event.preventDefault();

            const name = document
                .querySelector('#celebrity-form .name').value
                .trim()
            ;

            const generator = getSeededRng(convertLetterToNumber(name
                .toLowerCase()
            ));
            const trainer = new TrainerGenerator(generator, pokebank, name);

            console.log(trainer);
        })
    ;
})

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