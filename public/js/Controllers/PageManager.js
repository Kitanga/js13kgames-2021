const PageClassNames = {
	ACTIVE: 'active',
	PAGE: 'page',
};

/**
 * The whole point of this class will be to control what scene is currently being shown to the player
 */
export class PageManager {
	/**
	 * @type { Map<string, { target: HTMLElement, startupMethod: Function }> }
	 * @private
	 */
	pages = new Map();

	/**
	 * @type { HTMLElement }
	 * @private
	 */
	currentlyActivePage = null;

	/** 
	 * @type { {[key: string]: Function} }
	 * @private
	 */
	actions = {
		goToMenu: () => {
			this.use('menu');
		},
		goToLoader: () => {
			this.use('loader');
		}
	};

	/**
	 * The container that holds all the pages
	 * @param {string} pageContainerID Page container ID
	 */
	registerPage = (pageContainerID) => {
		this.pageContainer = document.getElementById(pageContainerID);

		if (this.pageContainer) {
			this.pageContainer.querySelectorAll('.page').forEach(page => {
				const callbackName = page.getAttribute('data-startUpMethod');

				if (callbackName) {
					this.getAction(callbackName, (action) => {
						this.add(page.id, action);
					});
				} else {
					this.add(page.id);
				}
			});
		} else {
			throw new Error(`Failed to register main pages element. Remember, an element with ID = ${pageContainerID} should exist in html page`);
		}
	}

	setAction(actionName, action) {
		if (action) {
			this.actions[actionName] = action;
		} else {
			throw new Error("Please set the action function");
		}
	}

	/**
	 * Get the element by ID and add it as a page to the manager
	 * @param {string} childElementID A callback name
	 * @param {Function} [actionFoundCallback] A function that runs when a call is found
	 *
	 * @private
	 */
	getAction(callbackName, actionFoundCallback) {
		const callback = this.actions[callbackName];

		if (callback) {
			actionFoundCallback(callback || function () {});
		} else {
			throw new Error(`The action name, ${callbackName}, doesn't exist in PageManager.actions`);
		}
	}

	/**
	 * Get the element by ID and add it as a page to the manager
	 * @param {string} childElementID The element's ID
	 * @param {Function} [startupMethod] A function that will be run after showing page
	 *
	 * @private
	 */
	add = (childElementID, startupMethod) => {
		const element = document.getElementById(childElementID);

		if (!element) {
			throw new Error("The page you are trying to add isn't in HTML code");
		}

		if (!element.classList.contains(PageClassNames.PAGE)) {
			throw new Error("This element needs to have the .page class name");
		}

		let callBack = function () {};

		if (typeof startupMethod == 'string') {
			this.getAction(startupMethod, (action) => {
				callBack = action;
			});
		} else if (typeof startupMethod == 'function') {
			callBack = startupMethod;
		}

		this.pages.set(childElementID, {
			target: element,
			startupMethod: callBack
		});

		// Register onclick events for elements with the custom prop
		element.querySelectorAll('[data-onclick]').forEach((ele) => {
			const callbackName = ele.getAttribute('data-onclick');

			if (callbackName) {
				this.getAction(callbackName, (action) => {
					ele.onclick = action;
				});
			}
		});
	}

	use = (key) => {
		if (this.pages.has(key)) {
			const page = this.pages.get(key);

			this.deactivateActivePage();
			this.currentlyActivePage = page.target;
			this.activeCurrentPage();
			page.startupMethod && page.startupMethod();
		} else {
			throw new Error("You have tried to use a key that isn't in the pages list");
		}
	}

	/** 
	 * Show the currently active page
	 * 
	 * @private
	 */
	activeCurrentPage = () => {
		this.currentlyActivePage && this.currentlyActivePage.classList.add(PageClassNames.ACTIVE);
	}

	/** 
	 * Hide the currently active page
	 * 
	 * @private
	 */
	deactivateActivePage = () => {
		this.currentlyActivePage && this.currentlyActivePage.classList.remove(PageClassNames.ACTIVE);
	}
}