import { AssetLoader } from '../Controllers/AssetLoader.js';
import {
	PageManager
} from '../Controllers/PageManager.js';

/**
 * Game Engine
 */
export class Engine {
	pageManager = new PageManager();
	assetLoader = new AssetLoader();

	setupActions() {
		// Register the actions that will run for each page
		this.pageManager.setAction('onShowMenu', () => {
			console.log('Hello');
		});

		this.pageManager.setAction('clicked', () => {
			console.log('Awe!');
		});

		this.pageManager.setAction('goToGame', () => {
			console.log('Game has started!');
		});
	}
}