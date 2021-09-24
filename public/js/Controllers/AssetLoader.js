export class AssetLoader {
	/**
	 * @type { { [key:string]: HTMLImageElement | HTMLAudioElement } }
	 * @private
	 */
	cache = {};
	/**
	 * @type { [string, string][] }
	 * @private
	 */
	assetList = [];
	/**
	 * @type { { extensions: string[], loader: ((blob: Blob) => any)}[] }
	 * @private
	 */
	supportedExtensions = [
		// TODO: change this to use an object with `extensions` and `loader` as the props
		{
			extensions: ['.png', '.jpg', '.svg'],
			loader: ImageLoader
		}
	];
	/**
	 * @type { number }
	 * @private
	 */
	totalAssetsCount = 0;
	/**
	 * @type { number }
	 * @private
	 */
	loadedAssetsCount = 0;

	/**
	 * @param { string } assetConfig
		// TODO: change this to use an object with `extensions` and `loader` as the props
	 * @param { { extensions: string[], loader: ((blob: Blob) => any)}[] } supportedExtensions
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
	 * @param { string } key
	 * @param { HTMLImageElement | HTMLAudioElement } asset
	 * @private
	 */
	addToCache = (key, asset) => {
		this.cache[key] = asset;
	}

	// These are event methods
	/**
	 * Runs when all assets have been loaded
	 * @param { AssetLoader } assetLoader 
	 */
	onComplete = (assetLoader) => {
		console.log('Assets done loading');
	}
	/**
	 * Runs when a file has finished loading
	 * @param { number } progress 
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
	 * @param {string} key 
	 * @param {string} link 
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
 * 
 * @param { Blob } blob 
 */
export function ImageLoader(blob) {
	const img = new Image();
	img.src = window.URL.createObjectURL(blob);

	return img;
}