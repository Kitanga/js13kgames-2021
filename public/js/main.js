import { Engine } from './Engine/Engine.js';

const Game = new Engine();

Game.setupActions();

const loader = Game.assetLoader;

loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');
loader.add('capsule', 'Assets/capsule.svg');

loader.onComplete = (assetLoader) => {
	console.log('We are done loading assets!!');
	Game.pageManager.use('menu');
};

const loaderBar = document.getElementById('loader-bar');
loader.onProgress = (progress) => {
	console.log(`Progress: ${progress * 100}%`);
	loaderBar.style.width = `${progress * 100}%`;
};

loader.start();

// Then register the pages' container
Game.pageManager.registerPage('pages');

// Tell the game to show the menu page
Game.pageManager.use('loader');