/**
 * Downloads and caches game assets
 */
export class AssetLoader {
	/**
	 * We'll store the downloaded assets in this cache
	 * 
	 * @type { { [key:string]: HTMLImageElement | HTMLAudioElement } }
	 * @private
	 */
	cache = {};
	/**
	 * The list of assets we'll be loading
	 * 
	 * @type { [string, string][] }
	 * @private
	 */
	assetList = [];
	/**
	 * An array containing supported file extensions and the loaders we'll use to process them.
	 * 
	 * @type { { extensions: string[], loader: ((blob: Blob) => any)}[] }
	 * @private
	 */
	supportedExtensions = [
		{
			extensions: ['.png', '.jpg', '.svg'],
			loader: ImageLoader
		}
	];
	/**
	 * The total number of assets being loaded
	 * 
	 * @type { number }
	 * @private
	 */
	totalAssetsCount = 0;
	/**
	 * How many assets have already been loaded
	 * 
	 * @type { number }
	 * @private
	 */
	loadedAssetsCount = 0;

	/**
	 * Returns a loader function for processing the linked resource
	 * 
	 * @param { string } assetLink The resource link to the asset (can be relative or absolute)
	 * @param { { extensions: string[], loader: ((blob: Blob) => any)}[] } supportedExtensions An array containing supported file extensions and the loaders we'll use to process them.
	 * @private
	 */
	getLoader = (assetLink, supportedExtensions) => {
		const extensionLoaderMap = supportedExtensions.find(extensionLoaderMap => {
			return !!extensionLoaderMap.extensions.find(extension => {
				return assetLink.includes(extension);
			});
		});
		
		return extensionLoaderMap.loader;
	};
	/**
	 * Adds the loaded and processed asset to the asset loader's cache
	 * 
	 * @param { string } key The unique string we'll use to store the game object into the cache
	 * @param { HTMLImageElement | HTMLAudioElement } asset The object returned from the loader that we'll be caching
	 * @private
	 */
	addToCache = (key, asset) => {
		this.cache[key] = asset;
	}

	// These are event methods
	/**
	 * Runs when all assets have been loaded
	 * 
	 * @param { AssetLoader } assetLoader A reference to the Asset loader instance
	 */
	onComplete = (assetLoader) => {
		console.log('Assets done loading');
	}
	/**
	 * Runs when a file has finished loading
	 * 
	 * @param { number } progress A number between 0 and 1 (percentage)
	 */
	onProgress = (progress) => {
		console.log('An asset has been loaded loading');
	}

	/** We run this method when we want to start loading assets. */
	start = () => {
		// Start loading all assets
		this.totalAssetsCount = this.assetList.length + document.images.length;
		this.loadedAssetsCount = 0;

		if (this.totalAssetsCount) {
			for (let ix = 0, length = document.images.length; ix < length; ix++) {
				const image = document.images[ix];

				if (image.complete) {
					this.loadedAssetsCount++;
				} else {
					image.addEventListener('load', () => {
						this.loadedAssetsCount++;
					});
				}
			}

			this.updateProgress();
			this.loadAssets();
		}
	}

	/**
	 * Adds a file we plan to load into the game
	 * 
	 * @param {string} key The unique string we'll use to store the game object into the cache
	 * @param {string} link The relative link to the asset (Can also be absolute, but be careful with using absolute values)
	 */
	add = (key, link) => {
		if (!!this.getLoader(link, this.supportedExtensions)) {
			this.assetList.push([key, link]);
		} else {
			throw new Error(`Failed to add asset with key ${key} and link ${link} to AssetLoader, because the file type is not supported.`);
		}
	}

	/**
	 * Loads assets in the assetList
	 * 
	 * @private
	 */
	loadAssets = () => {
		this.assetList.forEach(assetConfig => {
			const assetLink = assetConfig[1];
			const loader = this.getLoader(assetLink, this.supportedExtensions);
			const key = assetConfig[0];

			fetch(assetLink, {
					method: 'GET'
				})
				.then(response => response.blob())
				.then(loader)
				.then(img => {
					this.addToCache(key, img);
					this.loadedAssetsCount++;
					this.updateProgress();
				});
		});
	}

	/**
	 * Update progress
	 * 
	 * @private
	 */
	updateProgress = () => {
		// Update the progress value
		this.progress = this.loadedAssetsCount / this.totalAssetsCount;

		this.onProgress(Math.min(1, this.progress));

		if (this.progress >= 1) {
			this.onComplete(this);
		}
	}
}

/**
 * This processes the loaded content and returns a game usable cachable object
 * 
 * @param { Blob } blob A file received from the server as a blob
 */
export function ImageLoader(blob) {
	const img = new Image();
	img.src = window.URL.createObjectURL(blob);

	return img;
}