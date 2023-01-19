import path from 'path'
import { DirName } from '../Utils/Path.js'
import FileSystem from './FileSystem.js'
import { IData } from './Types.js'
import fs from 'fs/promises'
import { ValueOrFactory } from '../Utils/Types.js'

class Data {
	static #savePath = path.join(
		DirName(import.meta.url),
		'../../data/saves.json'
	)

	static #data: IData

	static get data() {
		return new Promise<IData>((resolve, reject) => {
			if (!this.#data) {
				fs.access(this.#savePath)
					.then(() => {
						FileSystem.Process(fs.readFile(this.#savePath))
							.then(file => {
								this.#data = JSON.parse(file.toString())

								resolve(this.#data)
							})
							.catch(reject)
					})
					.catch(() => {
						this.#data = { playlists: {} }
					})
			} else {
				resolve(this.#data)
			}
		})
	}

	static Flush() {
		FileSystem.Process(
			fs.writeFile(this.#savePath, JSON.stringify(this.data))
		)
	}

	static Set(data: IData) {
		this.#data = data
	}

	static async Update(dataOrFactory: ValueOrFactory<IData>) {
		let data: IData

		if (typeof dataOrFactory === 'function') {
			data = dataOrFactory(await this.data)
		} else {
			data = dataOrFactory
		}

		this.Set(data)
	}

	static async UpdateAndSave(dataOrFactory: ValueOrFactory<IData>) {
		await this.Update(dataOrFactory)

		this.Flush()
	}
}

export default Data
