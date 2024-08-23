# PokeCelebrities

## Description

This is a simple web application that allows users to enter someone's name and get a Pokémon team based on the name's characters.

This was first made to be used on my [Youtube channel](https://www.youtube.com/@citronenglishmode), but I decided to make it public so that my humble, messy code could be enjoyed by everyone.

## Usage

To use the application, simply enter a name in the input field and click the "Submit" button. The application will then generate a Pokémon team based on the name's characters.

The webpage is hosted on GitHub Pages and can be accessed [here](https://lecitronvert.github.io/celebrities-pokemon/).

You can also run the application locally by cloning the repository or downloading the source code. Keep in mind that, because I'm using ES6 Modules and *.mjs files, you'll need to run the application on a server. Any worth its salt should do.

## OBS mode

This app features an OBS mode. This streamlines the team preview to make it easier to layout in OBS.

Add the following parameters to your URL to enable OBS mode:
- `?obs=[name]` where name is the name you want to generate a team for. Small caveat : it has to be url encoded. Any should work, such as [this one](https://meyerweb.com/eric/tools/dencoder/).
- `&obs-bg=[color]` **optionally** where color is the background color of the team preview. It can be any valid CSS color. This is to make it easier to chroma key the background.

## Credits

- The application uses the [PokeAPI](https://pokeapi.co/) to get the Pokémon data.
- The application uses [PokeAPI/pokeapi-js-wrapper](https://github.com/PokeAPI/pokeapi-js-wrapper) to interact with the PokeAPI.
- The application uses a rip of Gen 5 sprites from Rick1234.

## TODO

- Adding an autocomplete feature to the input field. On some sort of celebrity API ?
- Adding a randomly generated trainer class related to the sprite.