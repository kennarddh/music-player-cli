class FileSystem {
	static #pendingPromise: Promise<any> | undefined

	static Process<T>(action: Promise<T>) {
		return new Promise<T>((resolve, reject) => {
			action.then(resolve)
			action.catch(reject)

			if (this.#pendingPromise)
				this.#pendingPromise.finally(() => {
					this.#pendingPromise = action
				})
			else this.#pendingPromise = action
		})
	}
}

export default FileSystem
