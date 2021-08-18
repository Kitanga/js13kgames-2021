import { Engine } from './Engine/Engine.js';

const Game = new Engine();

// Register the pages
// TODO: add a method of just collecting all the pages from a container/wrapper element. This way we just create the html and don't have to worry about registering pages
Game.pageManager.add('loader');
Game.pageManager.add('menu');

// Tell the game to start by using the Menu page
Game.pageManager.use('menu');