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
	 * @type { [string[], Loader][] }
	 * @private
	 */
	supportedExtensions = [
		[
			['.png', '.jpg', '.svg'],
			ImageLoader
		]
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
	 * @param { [string[], ImageLoader][] } supportedExtensions
	 * @private
	 */
	getLoader = (assetLink, supportedExtensions) => {
		const extensionLoaderMap = supportedExtensions.find(extensionLoaderMap => {
			return !!extensionLoaderMap[0].find(extension => {
				return assetLink.includes(extension);
			});
		});
		
		return extensionLoaderMap[1];
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

	add = (key, link) => {
		if (!!this.getLoader(link)) {
			this.assetList.push([key, link]);
		} else {
			throw new Error(`Failed to add asset with key ${key} and link ${link} to AssetLoader, because the file type is not supported.`);
		}
	}

	loadAssets = () => {
		this.assetList.forEach(assetConfig => {
			const loader = this.getLoader(assetLink, this.supportedExtensions);
			const key = assetConfig[0];
			const assetLink = assetConfig[1];

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