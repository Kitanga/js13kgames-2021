import { Engine } from './Engine/Engine.js';

const Game = new Engine();

// Register the pages
// TODO: add a method of just collecting all the pages from a container/wrapper element. This way we just create the html and don't have to worry about registering pages
// Game.pageManager.add('loader');
// Game.pageManager.add('menu');

// Register the actions that will run for each page
Game.pageManager.setAction('onShowMenu', () => {
	console.log('Hello');
});

// Then register the pages' container
Game.pageManager.registerPage('pages');

// Tell the game to show the menu page
Game.pageManager.use('menu');